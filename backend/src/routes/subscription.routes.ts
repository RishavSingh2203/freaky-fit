import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import { createSubscriptionOrder, verifySubscriptionPayment, getUserSubscription } from '../controllers/razorpay.controller';

const router = express.Router();

// POST /api/subscription/create-order - Create a new subscription order
router.post('/create-order', protect, createSubscriptionOrder);

// POST /api/subscription/verify-payment - Verify payment and activate subscription
router.post('/verify-payment', protect, verifySubscriptionPayment);

// GET /api/subscription/details - Get user subscription details
router.get('/details', protect, getUserSubscription);

export default router;
