import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const createOrder = async (req, res) => {
  const { shippingAddress, directBuyItems } = req.body;
  if (!shippingAddress) return res.status(400).json({ message: 'Shipping address is required' });
  try {
    let rawItems = [];
    let isDirectBuy = false;

    if (directBuyItems && directBuyItems.length > 0) {
      isDirectBuy = true;
      for (const item of directBuyItems) {
        const p = await Product.findById(item.product);
        if (p) rawItems.push({ product: p, quantity: item.quantity });
      }
      if (rawItems.length === 0) return res.status(400).json({ message: 'Invalid products for direct buy' });
    } else {
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
      rawItems = cart.items;
    }

    const orderItems = [];
    for (const item of rawItems) {
      const product = item.product;
      if (!product || product.status !== 'active') {
        return res.status(400).json({ message: `Product ${product?.name || 'unknown'} is not available` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      const discountedPrice = product.price - (product.price * product.discount) / 100;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: discountedPrice,
        quantity: item.quantity
      });
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    const totalAmount = subtotal + deliveryCharge;
    const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      deliveryCharge,
      totalAmount,
      deliveryOtp,
      paymentMethod: req.body.paymentMethod || 'online'
    });
    
    if (!isDirectBuy) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  if (!orderStatus) return res.status(400).json({ message: 'Order status is required' });
  try {
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) return res.status(404).json({ message: 'Order not found' });
    
    existingOrder.orderStatus = orderStatus;
    if (orderStatus === 'delivered' && existingOrder.paymentMethod === 'cod') {
      existingOrder.paymentStatus = 'paid';
    }
    
    await existingOrder.save();
    
    // Repopulate user to match old response
    await existingOrder.populate('user', 'name email');
    
    res.json(existingOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const trackOrder = async (req, res) => {
  const { orderNumber, email } = req.body;
  if (!orderNumber || !email) {
    return res.status(400).json({ message: 'Order number and email are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No orders found for this email' });
    
    const cleanOrderNumber = orderNumber.replace('#', '').toUpperCase();
    
    const orders = await Order.find({ user: user._id });
    const order = orders.find(o => o._id.toString().toUpperCase().endsWith(cleanOrderNumber));
    
    if (!order) return res.status(404).json({ message: 'Order not found with that ID' });
    
    res.json({
      _id: order._id,
      shortId: order._id.toString().slice(-8).toUpperCase(),
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      totalAmount: order.totalAmount,
      itemsCount: order.items.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const confirmDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (order.orderStatus !== 'shipped') {
      return res.status(400).json({ message: 'Order must be shipped before confirming delivery' });
    }
    
    order.orderStatus = 'delivered';
    order.paymentStatus = 'paid';
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.status(400).json({ message: 'OTP is required' });
  
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.deliveryOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      return res.status(400).json({ message: `Order is already ${order.orderStatus}` });
    }
    
    order.orderStatus = 'delivered';
    if (order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
