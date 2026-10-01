import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// protect middleware: Ye function check karta hai ki user logged in hai ya nahi
export const protect = async (req, res, next) => {
  // Frontend jab bhi request bhejta hai, toh wo apni cookies bhi bhejta hai. Hum wahan se 'jwt' token nikalte hain.
  const token = req.cookies.jwt;
  
  // Agar token nahi mila, iska matlab user logged in nahi hai. Error bhej do.
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
  
  try {
    // jwt.verify() check karta hai ki kya token asli hai (fake ya expire toh nahi hua).
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agar token sahi hai, toh usme se userId nikal kar database se user ka poora data dhoondho (password ko chhod kar).
    // Aur us data ko req.user mein daal do, taaki aage ke functions ko pata chal sake ki kaun request kar raha hai.
    req.user = await User.findById(decoded.userId).select('-passwordHash');
    
    // Agar user delete ho chuka hai database se.
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    
    // next() ka matlab hai ki sab theek hai, ab aage ka code chalne do (jaise getMe function ya koi aur logic).
    next();
  } catch (error) {
    // Agar token galat ya expire nikalta hai, toh error bhej do.
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// adminOnly middleware: Ye function check karta hai ki kya logged in user ek 'admin' hai?
export const adminOnly = (req, res, next) => {
  // protect middleware ke baad req.user mein data aata hai. Hum check kar rahe hain uski role 'admin' hai ya nahi.
  if (req.user && req.user.role === 'admin') {
    next(); // Agar admin hai, toh aage jane do.
  } else {
    // Agar normal user hai, toh Access Denied ka error bhej do.
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};
