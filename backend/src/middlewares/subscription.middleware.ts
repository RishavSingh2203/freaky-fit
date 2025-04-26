import { Request, Response, NextFunction } from 'express';
import Subscription from '../models/subscription.model';

// Middleware to check if user can generate a workout plan
export const canGenerateWorkoutPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, user not found' 
      });
    }

    // Find active subscription for the user
    const subscription = await Subscription.findOne({
      user: req.user._id,
      active: true,
      endDate: { $gte: new Date() }
    });

    // If no subscription found, create a free subscription
    if (!subscription) {
      // Create a free subscription that expires in 1 year
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      
      const newSubscription = await Subscription.create({
        user: req.user._id,
        plan: 'FREE',
        startDate: new Date(),
        endDate,
        active: true,
        workoutPlansGenerated: 0,
        mealPlansGenerated: 0
      });
      
      // If free subscription and already generated 2 workout plans, return error
      if (newSubscription.plan === 'FREE' && newSubscription.workoutPlansGenerated >= 2) {
        return res.status(403).json({
          success: false,
          message: 'Free subscription limit reached. Please upgrade to premium to generate more workout plans.',
          subscriptionRequired: true
        });
      }
      
      // Increment the workout plans generated count
      newSubscription.workoutPlansGenerated += 1;
      await newSubscription.save();
      
      next();
      return;
    }

    // If premium subscription, allow generation
    if (subscription.plan === 'PREMIUM') {
      next();
      return;
    }

    // If free subscription and already generated 2 workout plans, return error
    if (subscription.plan === 'FREE' && subscription.workoutPlansGenerated >= 2) {
      return res.status(403).json({
        success: false,
        message: 'Free subscription limit reached. Please upgrade to premium to generate more workout plans.',
        subscriptionRequired: true
      });
    }

    // Increment the workout plans generated count
    subscription.workoutPlansGenerated += 1;
    await subscription.save();

    next();
  } catch (error) {
    console.error('Subscription middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error checking subscription' 
    });
  }
};

// Middleware to check if user can generate a meal plan
export const canGenerateMealPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, user not found' 
      });
    }

    // Find active subscription for the user
    const subscription = await Subscription.findOne({
      user: req.user._id,
      active: true,
      endDate: { $gte: new Date() }
    });

    // If no subscription found, create a free subscription
    if (!subscription) {
      // Create a free subscription that expires in 1 year
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      
      const newSubscription = await Subscription.create({
        user: req.user._id,
        plan: 'FREE',
        startDate: new Date(),
        endDate,
        active: true,
        workoutPlansGenerated: 0,
        mealPlansGenerated: 0
      });
      
      // If free subscription and already generated 2 meal plans, return error
      if (newSubscription.plan === 'FREE' && newSubscription.mealPlansGenerated >= 2) {
        return res.status(403).json({
          success: false,
          message: 'Free subscription limit reached. Please upgrade to premium to generate more meal plans.',
          subscriptionRequired: true
        });
      }
      
      // Increment the meal plans generated count
      newSubscription.mealPlansGenerated += 1;
      await newSubscription.save();
      
      next();
      return;
    }

    // If premium subscription, allow generation
    if (subscription.plan === 'PREMIUM') {
      next();
      return;
    }

    // If free subscription and already generated 2 meal plans, return error
    if (subscription.plan === 'FREE' && subscription.mealPlansGenerated >= 2) {
      return res.status(403).json({
        success: false,
        message: 'Free subscription limit reached. Please upgrade to premium to generate more meal plans.',
        subscriptionRequired: true
      });
    }

    // Increment the meal plans generated count
    subscription.mealPlansGenerated += 1;
    await subscription.save();

    next();
  } catch (error) {
    console.error('Subscription middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error checking subscription' 
    });
  }
};
