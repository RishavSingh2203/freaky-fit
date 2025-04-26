"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutPlanGenerator = void 0;
const workout_prompt_1 = __importDefault(require("../prompts/workout.prompt"));
const gemini_1 = __importDefault(require("./gemini"));
const pexels_1 = __importDefault(require("./pexels"));
// Type guard function to check if data is a WorkoutPlan
function isWorkoutPlan(data) {
    return data && 'workout_plan' in data;
}
const workoutPlanGenerator = async ({ fitnessLevel, fitnessGoal, duration, daysPerweek }) => {
    try {
        const prompt = (0, workout_prompt_1.default)({ fitnessLevel, fitnessGoal, duration, daysPerweek });
        const result = await (0, gemini_1.default)(prompt);
        // Check if the Gemini API call was successful
        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to generate workout plan",
                error: result.error
            };
        }
        // Validate the workout plan data
        if (!result.data || !isWorkoutPlan(result.data) || !result.data.workout_plan) {
            return {
                success: false,
                message: "Invalid workout plan data received",
                error: "Missing workout plan data"
            };
        }
        // Replace GIF URLs with Pexels videos for all exercises
        const workoutPlan = result.data.workout_plan;
        // Process daily workouts
        for (const day of Object.keys(workoutPlan.daily_workouts)) {
            for (const exercise of workoutPlan.daily_workouts[day].exercises) {
                exercise.gif_url = await (0, pexels_1.default)(exercise.name);
            }
        }
        // Process warm-up exercises
        for (const exercise of workoutPlan.warm_up.exercises) {
            exercise.gif_url = await (0, pexels_1.default)(exercise.name);
        }
        // Process cool-down exercises
        for (const exercise of workoutPlan.cool_down.exercises) {
            exercise.gif_url = await (0, pexels_1.default)(exercise.name);
        }
        return {
            success: true,
            message: "Workout plan generated successfully",
            data: { workout_plan: workoutPlan }
        };
    }
    catch (error) {
        console.error("Error generating workout plan:", error);
        return {
            success: false,
            message: "Failed to generate workout plan",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
};
exports.workoutPlanGenerator = workoutPlanGenerator;
exports.default = exports.workoutPlanGenerator;
