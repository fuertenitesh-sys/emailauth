import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign({ role: 'admin', username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('admin_jwt', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
    res.json({ success: true, message: 'Admin login successful' });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};

export const adminLogout = (req, res) => {
  res.cookie('admin_jwt', '', { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(0) });
  res.json({ message: 'Logged out' });
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalCategories, totalOrders, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
      Order.find().select('totalAmount orderStatus')
    ]);
    const revenue = orders.filter(o => o.orderStatus !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
    res.json({ totalUsers, totalProducts, totalCategories, totalOrders, revenue, pendingOrders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAdminAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateAdminOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true }).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
