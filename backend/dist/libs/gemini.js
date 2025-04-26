"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gemini = gemini;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function gemini(prompt) {
    try {
        const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        console.log('Sending prompt to Gemini...');
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        const text = response.text;
        console.log('Raw Gemini response:', text);
        if (!text)
            throw new Error('No response from Gemini');
        // Clean the response text to ensure valid JSON
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        // console.log('Cleaned response text:', cleanedText);
        try {
            // Parse the JSON response
            const parsedResponse = JSON.parse(cleanedText);
            // console.log('Parsed response:', JSON.stringify(parsedResponse, null, 2));
            // Check if it's a workout plan or meal plan
            if ('workout_plan' in parsedResponse) {
                console.log('Validating workout plan structure...');
                const workoutPlan = parsedResponse;
                // Validate workout plan structure
                if (!workoutPlan.workout_plan.description || !workoutPlan.workout_plan.schedule || !workoutPlan.workout_plan.daily_workouts) {
                    throw new Error('Invalid workout plan structure');
                }
                // Validate daily workouts structure
                const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                for (const day of days) {
                    if (!workoutPlan.workout_plan.daily_workouts[day]) {
                        throw new Error(`Invalid response structure: missing exercises for ${day}`);
                    }
                    if (!Array.isArray(workoutPlan.workout_plan.daily_workouts[day].exercises)) {
                        throw new Error(`Invalid response structure: exercises for ${day} must be an array`);
                    }
                }
                // Validate warm-up exercises
                if (!Array.isArray(workoutPlan.workout_plan.warm_up.exercises)) {
                    throw new Error('Invalid response structure: warm-up exercises must be an array');
                }
                // Validate cool-down exercises
                if (!Array.isArray(workoutPlan.workout_plan.cool_down.exercises)) {
                    throw new Error('Invalid response structure: cool-down exercises must be an array');
                }
                return {
                    success: true,
                    message: 'Workout plan retrieved successfully',
                    data: workoutPlan
                };
            }
            else if ('meal_plan' in parsedResponse) {
                console.log('Validating meal plan structure...');
                const mealPlan = parsedResponse;
                // Validate meal plan structure
                if (!mealPlan.meal_plan.description) {
                    console.log('Missing description in meal plan, setting default');
                    mealPlan.meal_plan.description = "Your personalized meal plan";
                }
                if (typeof mealPlan.meal_plan.daily_calories !== 'number' || isNaN(mealPlan.meal_plan.daily_calories)) {
                    console.log('Invalid daily_calories in meal plan, setting default');
                    mealPlan.meal_plan.daily_calories = 2000;
                }
                if (!mealPlan.meal_plan.weekly_plan) {
                    console.log('Missing weekly_plan in meal plan, creating empty structure');
                    mealPlan.meal_plan.weekly_plan = {
                        monday: {}, tuesday: {}, wednesday: {}, thursday: {},
                        friday: {}, saturday: {}, sunday: {}
                    };
                }
                // Validate weekly plan structure
                const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                for (const day of weekDays) {
                    if (!mealPlan.meal_plan.weekly_plan[day]) {
                        console.log(`Missing ${day} in weekly plan, creating empty structure`);
                        mealPlan.meal_plan.weekly_plan[day] = {};
                    }
                    // Validate meal types for each day
                    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
                    for (const type of mealTypes) {
                        if (!Array.isArray(mealPlan.meal_plan.weekly_plan[day][type])) {
                            console.log(`Invalid ${type} structure for ${day}, creating empty array`);
                            mealPlan.meal_plan.weekly_plan[day][type] = [];
                        }
                        // Process each meal in the array instead of validating strictly
                        mealPlan.meal_plan.weekly_plan[day][type] = mealPlan.meal_plan.weekly_plan[day][type].map((meal, index) => {
                            // Return meal with defaults for missing properties
                            return {
                                name: meal.name || 'Unnamed Meal',
                                calories: typeof meal.calories === 'number' ? Math.max(0, meal.calories) : 300,
                                protein: typeof meal.protein === 'number' ? Math.max(0, meal.protein) : 10,
                                carbs: typeof meal.carbs === 'number' ? Math.max(0, meal.carbs) : 30,
                                fat: typeof meal.fat === 'number' ? Math.max(0, meal.fat) : 10,
                                prepTime: typeof meal.prepTime === 'number' ? Math.max(0, meal.prepTime) : 15,
                                image: meal.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
                                ingredients: Array.isArray(meal.ingredients) ? meal.ingredients.map(String) : ['No ingredients listed'],
                                instructions: meal.instructions || 'No instructions provided'
                            };
                        });
                    }
                }
                // console.log('Meal plan processing successful');
                return {
                    success: true,
                    message: 'Meal plan retrieved successfully',
                    data: mealPlan
                };
            }
            else {
                console.error('Invalid response type:', parsedResponse);
                throw new Error('Invalid response structure: neither workout plan nor meal plan');
            }
        }
        catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            throw new Error(`Failed to parse response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
    }
    catch (error) {
        console.error('Error in Gemini API:', error);
        return {
            success: false,
            message: 'An error occurred while retrieving the response',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
exports.default = gemini;
