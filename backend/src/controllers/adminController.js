import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate Admin JWT token
const generateAdminToken = (res) => {
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.cookie('admin_jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUser && password === adminPass) {
    generateAdminToken(res);
    res.json({
      success: true,
      message: 'Admin login successful'
    });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};

export const adminLogout = (req, res) => {
  res.cookie('admin_jwt', '', { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'none', 
    expires: new Date(0) 
  });
  res.json({ message: 'Admin logged out successfully' });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
