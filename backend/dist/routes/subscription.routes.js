"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const razorpay_controller_1 = require("../controllers/razorpay.controller");
const router = express_1.default.Router();
// POST /api/subscription/create-order - Create a new subscription order
router.post('/create-order', auth_middleware_1.protect, razorpay_controller_1.createSubscriptionOrder);
// POST /api/subscription/verify-payment - Verify payment and activate subscription
router.post('/verify-payment', auth_middleware_1.protect, razorpay_controller_1.verifySubscriptionPayment);
// GET /api/subscription/details - Get user subscription details
router.get('/details', auth_middleware_1.protect, razorpay_controller_1.getUserSubscription);
exports.default = router;
