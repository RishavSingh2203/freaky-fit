import express from 'express';
import {getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { 
  generateWorkoutPlan, 
  generateMealPlan, 
  ChatWithAI, 
  recipeGenerator, 
  saveMealPlan, 
  saveWorkoutPlan, 
  getSavedMealPlans, 
  getSavedWorkoutPlans,
  getSavedMealPlanById,
  getSavedWorkoutPlanById
} from '../controllers/fitness.controller';
import { canGenerateWorkoutPlan, canGenerateMealPlan } from '../middlewares/subscription.middleware';
import subscriptionRoutes from '../routes/subscription.routes';
import trainerRoutes from './Trainer.routes'

const router = express.Router();

// GET /api/users/profile - Get user profile
router.get('/profile', protect, getUserProfile);

// POST /api/users/profile - Update user profile
router.post('/profile', protect, updateUserProfile);

// POST /api/users/generate-workout-plan - Generate workout plan
router.post('/generate-workout-plan', protect, canGenerateWorkoutPlan, generateWorkoutPlan);

// POST /api/users/generate-meal-plan - Generate meal plan
router.post('/generate-meal-plan', protect, canGenerateMealPlan, generateMealPlan);

// POST /api/users/chat - Chat with AI
router.post('/ai-chat', protect, ChatWithAI);

// POST /api/users/generate-recipe - Generate recipe
router.post('/generate-recipe', protect, recipeGenerator);

// POST /api/users/save-meal-plan - Save meal plan
router.post('/save-meal-plan', protect, saveMealPlan);

// POST /api/users/save-workout-plan - Save workout plan
router.post('/save-workout-plan', protect, saveWorkoutPlan);

// GET /api/users/saved-meal-plans - Get all saved meal plans
router.get('/saved-meal-plans', protect, getSavedMealPlans);

// GET /api/users/saved-meal-plans/:id - Get specific meal plan
router.get('/saved-meal-plans/:id', protect, getSavedMealPlanById);

// GET /api/users/saved-workout-plans - Get all saved workout plans
router.get('/saved-workout-plans', protect, getSavedWorkoutPlans);

// GET /api/users/saved-workout-plans/:id - Get specific workout plan
router.get('/saved-workout-plans/:id', protect, getSavedWorkoutPlanById);

// Use subscription routes
router.use('/subscription', subscriptionRoutes);

// Use trainer routes
router.use('/trainer', trainerRoutes);

export default router;