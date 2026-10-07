import axios from 'axios';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';

const CASHFREE_BASE_URL = 'https://sandbox.cashfree.com/pg';
const API_VERSION = '2023-08-01';

const getCashfreeHeaders = () => ({
  'x-client-id': process.env.CASHFREE_APP_ID,
  'x-client-secret': process.env.CASHFREE_SECRET_KEY,
  'x-api-version': API_VERSION,
  'Content-Type': 'application/json',
});

export const createCashfreeOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: 'Order ID is required' });

    // Ensure the order belongs to the user and is still pending
    const order = await Order.findOne({ _id: orderId, user: req.user._id }).populate('user');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus === 'paid') return res.status(400).json({ message: 'Order is already paid' });

    const cashfreeOrderId = `order_${order._id}_${Date.now()}`;

    const payload = {
      order_id: cashfreeOrderId,
      order_amount: Number(order.totalAmount.toFixed(2)) || 1.00,
      order_currency: 'INR',
      customer_details: {
        customer_id: req.user._id.toString(),
        customer_phone: (order.shippingAddress.phone && order.shippingAddress.phone.length >= 10) ? order.shippingAddress.phone.substring(0, 14) : '9999999999',
        customer_name: order.shippingAddress.fullName || req.user.name || 'User',
        customer_email: order.shippingAddress.email || req.user.email || 'customer@example.com'
      },
      order_meta: {
        // Safe redirect handling for Sandbox, though mostly frontend SDK is used
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order._id}`
      }
    };

    // Create Cashfree Order
    const response = await axios.post(`${CASHFREE_BASE_URL}/orders`, payload, {
      headers: getCashfreeHeaders()
    });

    const paymentSessionId = response.data.payment_session_id;

    // Create a pending payment record
    await Payment.create({
      user: req.user._id,
      orderId: order._id,
      cfOrderId: cashfreeOrderId,
      cfPaymentSessionId: paymentSessionId,
      amount: order.totalAmount,
    });

    res.json({
      paymentSessionId: paymentSessionId,
      orderId: cashfreeOrderId
    });
  } catch (error) {
    console.error('Cashfree Create Order Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error creating Cashfree order', error: error.response?.data?.message || error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { order_id } = req.body; // Cashfree Order ID

    if (!order_id) {
      return res.status(400).json({ message: 'Order ID is missing' });
    }

    // Find the corresponding payment record and ensure it belongs to the authenticated user
    const payment = await Payment.findOne({ cfOrderId: order_id, user: req.user._id });
    if (!payment) return res.status(404).json({ message: 'Payment record not found or unauthorized' });

    // Idempotency check: if already successful, do not duplicate updates
    if (payment.status === 'successful') {
      return res.json({ success: true, message: 'Payment already verified successfully' });
    }

    // Call Cashfree API to verify payment status
    const response = await axios.get(`${CASHFREE_BASE_URL}/orders/${order_id}/payments`, {
      headers: getCashfreeHeaders()
    });

    const payments = response.data;
    
    // Check if there is any successful payment in the array
    const successfulPayment = payments.find(p => p.payment_status === 'SUCCESS');

    if (successfulPayment) {
      // Use atomic update to prevent race conditions from concurrent clicks/webhooks
      const updatedPayment = await Payment.findOneAndUpdate(
        { _id: payment._id, status: { $ne: 'successful' } },
        { status: 'successful' },
        { new: true }
      );

      if (updatedPayment) {
        // Update Order status
        await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'paid' });
      }

      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      // If no successful payment found
      await Payment.findOneAndUpdate(
        { cfOrderId: order_id },
        { status: 'failed' }
      );
      res.status(400).json({ success: false, message: 'Payment not successful yet' });
    }
  } catch (error) {
    console.error('Cashfree Verify Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error verifying payment', error: error.response?.data?.message || error.message });
  }
};
