import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true, // Render par hamesha https hota hai, isliye true rakhein
    sameSite: 'none', // CROSS-DOMAIN support ke liye ye zaroori hai (frontend alag link par hai, backend alag par)
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// ==========================================
// 1. SIGNUP API (Naya Account Banana - with OTP)
// ==========================================
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim() || !email || !email.trim() || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // REAL COMPANY SECURITY: Name validation (Must contain at least one letter)
  const nameRegex = /^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ message: 'Name must contain letters' });
  }

  try { 
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10); 
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({ 
      name, 
      email, 
      passwordHash,
      isVerified: true
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: 'Registration successful!',
        requiresOTP: false
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (error) {
    // Agar MongoDB ka apna validation error aaye, toh 400 bhejein
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// 1.5 VERIFY EMAIL API (OTP Check karna)
// ==========================================
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.verificationOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // OTP is correct and not expired. Verify the user!
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Now log them in securely by issuing the token
    generateToken(res, user._id);
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: 'Email verified successfully! You are now logged in.',
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// 2. LOGIN API (Purane Account mein aana)
// ==========================================
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// 3. LOGOUT API
// ==========================================
export const logout = (req, res) => {
  res.cookie('jwt', '', { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'none', 
    expires: new Date(0) 
  });
  res.json({ message: 'Logged out successfully' });
};

// ==========================================
// 4. GET ME API
// ==========================================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
