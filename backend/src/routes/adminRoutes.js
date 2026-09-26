import express from 'express';
import { adminLogin, adminLogout, getAdminUsers, getDashboardStats, getAdminAllOrders, updateAdminOrderStatus } from '../controllers/adminController.js';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/logout', adminLogout);

router.get('/stats', protectAdmin, getDashboardStats);
router.get('/users', protectAdmin, getAdminUsers);

router.get('/categories', protectAdmin, getAllCategories);
router.post('/categories', protectAdmin, createCategory);
router.put('/categories/:id', protectAdmin, updateCategory);
router.delete('/categories/:id', protectAdmin, deleteCategory);

router.get('/products', protectAdmin, getAllProducts);
router.post('/products', protectAdmin, createProduct);
router.put('/products/:id', protectAdmin, updateProduct);
router.delete('/products/:id', protectAdmin, deleteProduct);

router.get('/orders', protectAdmin, getAdminAllOrders);
router.put('/orders/:id/status', protectAdmin, updateAdminOrderStatus);

export default router;
