"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const fitness_controller_1 = require("../controllers/fitness.controller");
const subscription_middleware_1 = require("../middlewares/subscription.middleware");
const subscription_routes_1 = __importDefault(require("../routes/subscription.routes"));
const Trainer_routes_1 = __importDefault(require("./Trainer.routes"));
const router = express_1.default.Router();
// GET /api/users/profile - Get user profile
router.get('/profile', auth_middleware_1.protect, user_controller_1.getUserProfile);
// POST /api/users/profile - Update user profile
router.post('/profile', auth_middleware_1.protect, user_controller_1.updateUserProfile);
// POST /api/users/generate-workout-plan - Generate workout plan
router.post('/generate-workout-plan', auth_middleware_1.protect, subscription_middleware_1.canGenerateWorkoutPlan, fitness_controller_1.generateWorkoutPlan);
// POST /api/users/generate-meal-plan - Generate meal plan
router.post('/generate-meal-plan', auth_middleware_1.protect, subscription_middleware_1.canGenerateMealPlan, fitness_controller_1.generateMealPlan);
// POST /api/users/chat - Chat with AI
router.post('/chat', auth_middleware_1.protect, fitness_controller_1.ChatWithAI);
// POST /api/users/generate-recipe - Generate recipe
router.post('/generate-recipe', auth_middleware_1.protect, fitness_controller_1.recipeGenerator);
// POST /api/users/save-meal-plan - Save meal plan
router.post('/save-meal-plan', auth_middleware_1.protect, fitness_controller_1.saveMealPlan);
// POST /api/users/save-workout-plan - Save workout plan
router.post('/save-workout-plan', auth_middleware_1.protect, fitness_controller_1.saveWorkoutPlan);
// GET /api/users/saved-meal-plans - Get all saved meal plans
router.get('/saved-meal-plans', auth_middleware_1.protect, fitness_controller_1.getSavedMealPlans);
// GET /api/users/saved-meal-plans/:id - Get specific meal plan
router.get('/saved-meal-plans/:id', auth_middleware_1.protect, fitness_controller_1.getSavedMealPlanById);
// GET /api/users/saved-workout-plans - Get all saved workout plans
router.get('/saved-workout-plans', auth_middleware_1.protect, fitness_controller_1.getSavedWorkoutPlans);
// GET /api/users/saved-workout-plans/:id - Get specific workout plan
router.get('/saved-workout-plans/:id', auth_middleware_1.protect, fitness_controller_1.getSavedWorkoutPlanById);
// Use subscription routes
router.use('/subscription', subscription_routes_1.default);
// Use trainer routes
router.use('/trainer', Trainer_routes_1.default);
exports.default = router;
