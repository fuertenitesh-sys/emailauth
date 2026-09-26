import express from 'express';
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.get('/', protectAdmin, getAllOrders);
router.put('/:id/status', protectAdmin, updateOrderStatus);

export default router;
