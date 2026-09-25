import jwt from 'jsonwebtoken';

export const protectAdmin = (req, res, next) => {
  let token = req.cookies.admin_jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.role === 'admin') {
        next();
      } else {
        res.status(401).json({ message: 'Not authorized as admin' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no admin token' });
  }
};
