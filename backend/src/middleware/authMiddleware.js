import jwt from 'jsonwebtoken'; // JWT import kar rahe hain taaki token(cookie) ko verify kiya ja sake.
import User from '../models/User.js'; // User model import kar rahe hain, checking ke baad database se user data nikalne ke liye.

// Protect ek Middleware hai. Ye frontend (React) aur humari API (jaise getMe, ya koi dashboard data) ke theek beech mein khada hota hai.
export const protect = async (req, res, next) => {
  // Sabse pehle ye request ki cookies mein se 'jwt' naam ki cookie dhoondhta hai.
  let token = req.cookies.jwt;

  // Agar user ki request mein cookie mili hai (matlab user ne login kiya tha):
  if (token) {
    try {
      // Ye JWT ticket ko verify karta hai. Check karta hai ki kya ye ticket sach mein humne (apne JWT_SECRET se) banaya tha?
      // Agar koi fraud token hoga ya expire ho gaya hoga, toh ye error phek dega jo catch block mein jayegi.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Token sahi tha! Ab token ke andar se humne user ki ID (decoded.userId) nikali aur database mein us insaan ko dhoondha.
      // Dhoondhne ke baad us user ko 'req.user' object mein daal diya. Iska fayda ye hai ki aage API ko pta chal jayega request kisne ki thi.
      req.user = await User.findById(decoded.userId).select('-passwordHash');
      
      // Agar token hai par database mein user milna band ho gaya (say account delete kar diya gaya ho), toh reject kar do.
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }
      
      // `next()` ka matlab hai "Sab theek hai, aap API ke paas (jaise getMe controller) ja sakte ho". Ye request ko aage bhej deta hai.
      next();
    } catch (error) {
      // Agar token chhed chhaad kiya hua ho ya expire ho chuka ho.
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // Agar request aayi aur usme token (cookie) tha hi nahi (user login nahi hai).
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
