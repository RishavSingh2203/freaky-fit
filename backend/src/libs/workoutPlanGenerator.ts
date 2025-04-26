import workoutPrompt from "../prompts/workout.prompt";
import gemini, { WorkoutPlan, GeminiResponse } from "./gemini";
import getExerciseVideo from "./pexels";

export interface workAttt {
    fitnessLevel: string;
    fitnessGoal: string;
    duration: string;
    daysPerweek: string;
}

// Type guard function to check if data is a WorkoutPlan
function isWorkoutPlan(data: any): data is WorkoutPlan {
    return data && 'workout_plan' in data;
}

export const workoutPlanGenerator = async ({fitnessLevel, fitnessGoal, duration, daysPerweek}: workAttt) => {
    try {
        const prompt = workoutPrompt({fitnessLevel, fitnessGoal, duration, daysPerweek});
        const result: GeminiResponse = await gemini(prompt);
        
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
                exercise.gif_url = await getExerciseVideo(exercise.name);
            }
        }

        // Process warm-up exercises
        for (const exercise of workoutPlan.warm_up.exercises) {
            exercise.gif_url = await getExerciseVideo(exercise.name);
        }

        // Process cool-down exercises
        for (const exercise of workoutPlan.cool_down.exercises) {
            exercise.gif_url = await getExerciseVideo(exercise.name);
        }

        return {
            success: true,
            message: "Workout plan generated successfully",
            data: { workout_plan: workoutPlan }
        };
    } catch (error) {
        console.error("Error generating workout plan:", error);
        return {
            success: false,
            message: "Failed to generate workout plan",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

export default workoutPlanGenerator;