import express from 'express';
import { addSubscriber, getSubscribers } from '../controllers/subscriberController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .post(addSubscriber)
  .get(protectAdmin, getSubscribers);

export default router;
