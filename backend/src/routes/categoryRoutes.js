import express from 'express';
import { getCategories, getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/all', protectAdmin, getAllCategories);
router.post('/', protectAdmin, createCategory);
router.put('/:id', protectAdmin, updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

export default router;
