import express from 'express';
import { adminLogin, adminLogout, getAllUsers } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.get('/users', protectAdmin, getAllUsers);

export default router;
