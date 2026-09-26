import express from 'express';
import { getProducts, getProductById, getProductsByCategory, getAllProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/all', protectAdmin, getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductsByCategory);
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
