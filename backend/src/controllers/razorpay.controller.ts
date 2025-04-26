import { Request, Response } from "express";
import User from "../models/user.model";
import Payment from "../models/payment.model";
import Subscription from "../models/subscription.model";
import crypto from "crypto";
import instance from "../config/Razorpay.config";

// Constants for subscription plans
const SUBSCRIPTION_PLANS = {
  PREMIUM: {
    name: "Premium Plan",
    description: "Unlimited workout and meal plans generation",
    amount: 49900, // ₹499 in paise
    currency: "INR",
    duration: 30, // days
  },
};

// Create a new subscription order
export const createSubscriptionOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    const { plan } = req.body;

    if (!plan || !SUBSCRIPTION_PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription plan",
      });
    }

    const planDetails = SUBSCRIPTION_PLANS[plan];

    // Check if Razorpay keys are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay API keys are missing in environment variables');
      return res.status(500).json({
        success: false,
        message: "Payment gateway configuration error",
      });
    }

    // Create Razorpay order
    try {
      const options = {
        amount: planDetails.amount,
        currency: planDetails.currency,
        receipt: `subscription_${req.user._id}`,
        notes: {
          userId: req.user._id.toString(),
          plan,
        },
      };
      
      console.log('Creating Razorpay order with options:', JSON.stringify(options));
      console.log('Using Razorpay key ID:', process.env.RAZORPAY_KEY_ID);
      
      const order = await instance.orders.create(options);
      console.log('Razorpay order created successfully:', order);

      // Save order details in Payment model
      await Payment.create({
        user: req.user._id,
        orderId: order.id,
        amount: planDetails.amount / 100, // Convert paise to rupees for storage
        currency: planDetails.currency,
        status: "created",
        description: `${planDetails.name} - ${planDetails.description}`,
      });

      // Return order details to frontend
      return res.status(200).json({
        success: true,
        message: "Subscription order created successfully",
        data: {
          order,
          planDetails,
          key: process.env.RAZORPAY_KEY_ID,
        },
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  } catch (error) {
    console.error("Error creating subscription order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create subscription order",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Verify payment and activate subscription
export const verifySubscriptionPayment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Check if all required fields are present
    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    let isAuthentic = false;

    // Verify the payment signature
    try {
      // Find the order in our database
      const payment = await Payment.findOne({ orderId: razorpay_order_id });
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Verify signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

      isAuthentic = expectedSignature === razorpay_signature;
    } catch (error) {
      console.error("Error verifying payment signature:", error);
      return res.status(500).json({
        success: false,
        message: "Error verifying payment",
      });
    }

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Find the payment record
    const payment = await Payment.findOne({ orderId: razorpay_order_id });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Update payment status
    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = "captured";
    await payment.save();

    // Get payment details from Razorpay
    const paymentDetails = await instance.payments.fetch(razorpay_payment_id);

    // Calculate subscription end date (30 days from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + SUBSCRIPTION_PLANS.PREMIUM.duration);

    // Create or update subscription
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      active: true,
    });

    if (existingSubscription) {
      // If there's an existing active subscription, extend it
      existingSubscription.plan = "PREMIUM";
      existingSubscription.endDate = endDate;
      existingSubscription.active = true;
      existingSubscription.paymentId = razorpay_payment_id;
      existingSubscription.orderId = razorpay_order_id;
      await existingSubscription.save();
    } else {
      // Create a new subscription
      await Subscription.create({
        user: req.user._id,
        plan: "PREMIUM",
        startDate,
        endDate,
        active: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        workoutPlansGenerated: 0,
        mealPlansGenerated: 0,
      });
    }

    // Update user subscription status
    await User.findByIdAndUpdate(req.user._id, {
      subscriptionStatus: "PREMIUM",
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and subscription activated successfully",
      data: {
        subscription: {
          plan: "PREMIUM",
          startDate,
          endDate,
          paymentId: razorpay_payment_id,
        },
      },
    });
  } catch (error) {
    console.error("Error verifying subscription payment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify subscription payment",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Get user subscription details
export const getUserSubscription = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    // Find active subscription for the user
    const subscription = await Subscription.findOne({
      user: req.user._id,
      active: true,
      endDate: { $gte: new Date() },
    });

    if (!subscription) {
      return res.status(200).json({
        success: true,
        message: "No active subscription found",
        data: {
          subscription: {
            plan: "FREE",
            workoutPlansGenerated: 0,
            mealPlansGenerated: 0,
            active: false,
          },
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscription details retrieved successfully",
      data: {
        subscription: {
          plan: subscription.plan,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          workoutPlansGenerated: subscription.workoutPlansGenerated,
          mealPlansGenerated: subscription.mealPlansGenerated,
          active: subscription.active,
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving subscription details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve subscription details",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};