import express from 'express';
import { addSubscriber, getSubscribers } from '../controllers/subscriberController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(addSubscriber)
  .get(protect, adminOnly, getSubscribers);

export default router;
