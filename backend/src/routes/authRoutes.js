import express from 'express'; // Express framework ko import kar rahe hain URL routing ke liye.
import { signup, login, logout, getMe, verifyEmail } from '../controllers/authController.js'; // Jo functions humne controller mein banaye, unhe yahan laya ja raha hai.
import { protect } from '../middleware/authMiddleware.js'; // Ye hamara security guard (middleware) hai jo check karta hai ki user logged in hai ya nahi.

const router = express.Router(); // Naya Router object banaya taaki saare URLs ko isme baandh sakein.

// =====================================
// PUBLIC ROUTES (Bina login ke chalne wale)
// =====================================
// Jab frontend se `POST http://localhost:5000/api/auth/signup` URL hit hoga, toh controller ka `signup` wala function chalega.
router.post('/signup', signup);

// Jab frontend OTP daalega, toh `verifyEmail` function chalega.
router.post('/verify-email', verifyEmail);

// Jab frontend se `POST /login` par data aayega, toh controller ka `login` wala function chalega.
router.post('/login', login);

// Jab user logout button dabayega, toh `logout` function call hoga aur cookie delete hogi.
router.post('/logout', logout);

// =====================================
// PROTECTED ROUTES (Sirf Login hone par chalne wale)
// =====================================
// Jab frontend '/me' par request karta hai apna data mangne ke liye, toh beech mein humne `protect` middleware laga diya hai.
// Iska matlab `getMe` function chalne se PEHLE `protect` check karega ki user ke paas login ticket (cookie) hai ya nahi.
// Agar ticket hoga tabhi `protect` usko aage `getMe` ke paas jane dega, warna wahi se reject karke bhej dega.
router.get('/me', protect, getMe);

// In sabhi routes ko export kar rahe hain taaki server.js is router ko main application mein add kar sake.
export default router;
