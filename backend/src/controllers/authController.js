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
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// ==========================================
// 1. SIGNUP API (Naya Account Banana - with OTP)
// ==========================================
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try { 
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: 'User already exists and is verified' });
      }
      // If user exists but NOT verified, we will overwrite their OTP and resend it rather than blocking them.
    }

    const salt = await bcrypt.genSalt(10); 
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate a 6 digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Set expiry for 10 minutes from now
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (user) {
      // Update unverified user
      user.name = name;
      user.passwordHash = passwordHash;
      user.verificationOTP = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    } else {
      // Create new user
      user = await User.create({ 
        name, 
        email, 
        passwordHash,
        isVerified: false,
        verificationOTP: otp,
        otpExpiresAt
      });
    }

    // Email content
    const emailSubject = "EmailAuth - Verify Your Account";
    const emailMessage = `Hello ${name},\n\nYour OTP for account verification is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #2563eb;">Welcome to EmailAuth!</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for signing up. To complete your registration, please use the following One-Time Password (OTP):</p>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0f172a; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 14px;">This OTP is valid for 10 minutes.</p>
        <p>If you did not create an account, you can safely ignore this email.</p>
      </div>
    `;

    // Send the email
    const emailSent = await sendEmail({
      email: user.email,
      subject: emailSubject,
      message: emailMessage,
      html: emailHtml
    });

    if (emailSent) {
      res.status(201).json({
        message: 'Registration successful! Please check your email for the OTP to verify your account.',
        requiresOTP: true,
        email: user.email
      });
    } else {
      res.status(500).json({ message: 'Error sending verification email. Please try again.' });
    }

  } catch (error) {
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
      // Naya OTP feature: Agar user verified nahi hai, toh use login mat karne do.
      if (!user.isVerified) {
        return res.status(403).json({ 
          message: 'Please verify your email before logging in.',
          requiresOTP: true,
          email: user.email
        });
      }

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
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
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
