import express from 'express'; // Express.js ko import kar rahe hain, jo Node.js mein server aur APIs banane ke kaam aata hai.
import dotenv from 'dotenv'; // Dotenv ko import kar rahe hain, ye humari .env file se secret codes aur passwords ko padhne mein madad karta hai.
import cors from 'cors'; // CORS (Cross-Origin Resource Sharing) ko import kar rahe hain, ye frontend (React) aur backend ko ek dusre se data share karne ki permission deta hai.
import helmet from 'helmet'; // Helmet ek security package hai, jo humari APIs ko basic hack attacks se bachane ke liye headers set karta hai.
import cookieParser from 'cookie-parser'; // Cookie-parser import kar rahe hain, isse server frontend ke bheje gaye cookies (jisme JWT token hota hai) ko easily read kar pata hai.
import connectDB from './config/db.js'; // Humari khud ki banayi file jisme MongoDB (database) se connect karne ka code hai, usko import kar rahe hain.
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config(); // Ye command chalte hi .env file ke saare variables (jaise PORT, MONGODB_URI) system mein load ho jate hain aur process.env mein milte hain.

// Connect to MongoDB
connectDB(); // Database se connection banaya ja raha hai. Ye asynchronous kaam karta hai aur MongoDB Atlas se connect ho jata hai.

const app = express(); // Express app ka ek object 'app' naam se banaya. Iske zariye hum poora server control karenge.

// Middleware (Security aur data parsing ke liye beech ke functions)
app.use(helmet()); // Har aane wali request par Helmet security apply kar di.
app.use(cors({
  // CORS rules: Kaun humare server se baat kar sakta hai?
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Sirf humari React website (localhost:5173) ko permission mili hai.
  credentials: true, // Frontend ko cookies (JWT token) bhejne ki permission de rahe hain. Iske bina login maintain nahi hoga.
}));
app.use(express.json()); // Ye line check karti hai ki aane wala data JSON format mein hai toh usko sahi se read kare (req.body mein daal de).
app.use(express.urlencoded({ extended: true })); // Agar data form (URL-encoded) se aa raha hai, toh use parse karne ke liye.
app.use(cookieParser()); // Har request ke sath aane wali cookies ko asani se req.cookies mein read karne ke liye.

// Routes (Kaunse URL par kaunsa code chalega)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling Middleware (Agar server mein koi issue aaye toh kya hoga)
app.use((err, req, res, next) => {
  // Agar statusCode 200 (OK) hai par fir bhi error hai, toh use 500 (Server Error) maan lo, nahi toh jo status code aaya hai wahi rakho.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
  res.status(statusCode).json({
    // Error ka message user ko bhejo
    message: err.message,
    // Error kahan se aayi hai (stack trace) wo bhi bhejo, par sirf development mode mein (production mein chupate hain taaki hackers ko backend ki details na milen)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000; // Server chalane ke liye ek Port number tay kar rahe hain. Agar .env mein PORT hai toh wo, warna default 5000.

app.listen(PORT, () => {
  // Ye line server ko finally chaalu kar deti hai (sunne ke liye ready karti hai). Jab server start ho jata hai, tab console mein message print hota hai.
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
