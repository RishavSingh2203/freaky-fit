import { gemini } from "./gemini";
import { mealPrompt } from "../prompts/meal.prompt";

interface MealPlanRequest {
    dailyCalories: number;
    dietType: string;
    excludeIngredients?: string[];
    preparationTime: number;
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    isKeto: boolean;
    isLowCarb: boolean;
    isHighProtein: boolean;
    isLowFat: boolean;
}

interface Meal {
    name?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    prepTime?: number;
    image?: string;
    ingredients?: string[];
    instructions?: string;
}

interface DailyMeals {
    breakfast?: Meal[];
    lunch?: Meal[];
    dinner?: Meal[];
    snacks?: Meal[];
}

interface MealPlan {
    description?: string;
    daily_calories?: number;
    weekly_plan?: {
        monday?: DailyMeals;
        tuesday?: DailyMeals;
        wednesday?: DailyMeals;
        thursday?: DailyMeals;
        friday?: DailyMeals;
        saturday?: DailyMeals;
        sunday?: DailyMeals;
    };
}

export async function generateMealPlan(request: MealPlanRequest): Promise<{
    success: boolean;
    message: string;
    data?: {
        meal_plan: MealPlan;
    };
    error?: string;
}> {
    try {
        const prompt = mealPrompt({
            ...request,
            excludeIngredients: request.excludeIngredients || []
        });
        
        const result = await gemini(prompt);
        
        if (!result.success || !result.data || !('meal_plan' in result.data)) {
            return {
                success: false,
                message: "Failed to generate meal plan",
                error: result.error
            };
        }

        const mealPlan = result.data.meal_plan;

        // Initialize default values if missing
        mealPlan.description = mealPlan.description || "Your personalized meal plan";
        mealPlan.daily_calories = mealPlan.daily_calories || request.dailyCalories;
        mealPlan.weekly_plan = mealPlan.weekly_plan || {};

        // Process each day
        const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
        for (const day of weekDays) {
            if (!mealPlan.weekly_plan[day]) {
                mealPlan.weekly_plan[day] = {};
            }

            // Process each meal type
            const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
            for (const mealType of mealTypes) {
                if (!Array.isArray(mealPlan.weekly_plan[day][mealType])) {
                    mealPlan.weekly_plan[day][mealType] = [];
                }

                // Process each meal
                mealPlan.weekly_plan[day][mealType] = mealPlan.weekly_plan[day][mealType].map(meal => ({
                    name: String(meal.name || 'Unnamed Meal'),
                    calories: Math.max(0, Number(meal.calories) || 300),
                    protein: Math.max(0, Number(meal.protein) || 0),
                    carbs: Math.max(0, Number(meal.carbs) || 0),
                    fat: Math.max(0, Number(meal.fat) || 0),
                    prepTime: Math.max(0, Math.min(Number(meal.prepTime) || 0, request.preparationTime)),
                    image: String(meal.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'),
                    ingredients: Array.isArray(meal.ingredients) ? meal.ingredients.map(String) : ['No ingredients listed'],
                    instructions: String(meal.instructions || 'No instructions provided')
                }));
            }
        }

        return {
            success: true,
            message: "Meal plan generated successfully",
            data: { meal_plan: mealPlan }
        };
    } catch (error) {
        console.error('Error generating meal plan:', error);
        return {
            success: false,
            message: "Failed to generate meal plan",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

export default generateMealPlan;
