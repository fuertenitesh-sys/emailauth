import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';

export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: 'Order ID is required' });

    // Ensure the order belongs to the user and is still pending
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus === 'paid') return res.status(400).json({ message: 'Order is already paid' });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Razorpay amount is in paise (smallest currency unit), so multiply INR by 100
    const options = {
      amount: Math.round(order.totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_order_${order._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create a pending payment record
    await Payment.create({
      user: req.user._id,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
    });

    res.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      key_id: process.env.RAZORPAY_KEY_ID // Send only public key to frontend
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment details are missing' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Find the corresponding payment record and ensure it belongs to the authenticated user
      const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id, user: req.user._id });
      if (!payment) return res.status(404).json({ message: 'Payment record not found or unauthorized' });

      // Idempotency check: if already successful, do not duplicate updates
      if (payment.status === 'successful') {
        return res.json({ success: true, message: 'Payment already verified successfully' });
      }

      // Update payment record
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.status = 'successful';
      await payment.save();

      // Update Order status
      await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'paid' });

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      // Signature mismatch
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};
