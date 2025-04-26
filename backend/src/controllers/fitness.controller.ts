import { Request, Response } from "express"
import workoutPlanGenerator from "../libs/workoutPlanGenerator";
import { generateMealPlan as generateMealPlanService } from "../libs/mealPlanGenerator";
import { chat } from "../libs/AIChat";
import { array } from "zod";
import { generateRecipe } from "../libs/recipeGenerator";
import SavedMealPlan from "../models/SavedMealPlan";
import SavedWorkoutPlan from "../models/SavedWorkoutPlan";

export const generateWorkoutPlan = async (req: Request, res: Response) => {
    try {
        const { fitnessLevel, fitnessGoal, duration, daysPerweek } = req.body;
        
        // Validate required fields
        if (!fitnessLevel || !fitnessGoal || !duration || !daysPerweek) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory",
                requiredFields: {
                    fitnessLevel: "Fitness level (beginner/intermediate/advanced)",
                    fitnessGoal: "Fitness goal (e.g., build strength, lose weight)",
                    duration: "Workout duration per day",
                    daysPerweek: "Number of workout days per week"
                }
            });
        }

        // Generate the workout plan
        const result = await workoutPlanGenerator({
            fitnessLevel,
            fitnessGoal,
            duration,
            daysPerweek
        });

        // Check if the generation was successful
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.message || "Failed to generate workout plan",
                error: result.error
            });
        }

        // Return the formatted response
        return res.status(200).json({
            success: true,
            message: "Your workout plan is ready",
            data: {
                workout_plan: result.data?.workout_plan
            }
        });
    } catch (error) {
        console.error('Error generating workout plan:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate workout plan",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
    }
}; 

export const generateMealPlan = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {
            dailyCalories,
            dietType,
            excludeIngredients,
            preparationTime,
            isVegetarian,
            isVegan,
            isGlutenFree,
            isDairyFree,
            isKeto,
            isLowCarb,
            isHighProtein,
            isLowFat
        } = req.body;

        // Validate required fields
        if (!dailyCalories || !dietType || !preparationTime) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                requiredFields: {
                    dailyCalories: "Daily calorie target (number)",
                    dietType: "Type of diet (string)",
                    preparationTime: "Maximum preparation time in minutes (number)"
                }
            });
        }

        // Convert dailyCalories and preparationTime to numbers
        const parsedDailyCalories = Number(dailyCalories);
        const parsedPreparationTime = Number(preparationTime);

        if (isNaN(parsedDailyCalories) || isNaN(parsedPreparationTime)) {
            return res.status(400).json({
                success: false,
                message: "Invalid number format",
                error: "dailyCalories and preparationTime must be valid numbers"
            });
        }

        // Generate the meal plan
        const result = await generateMealPlanService({
            dailyCalories: parsedDailyCalories,
            dietType,
            excludeIngredients: excludeIngredients ? (Array.isArray(excludeIngredients) ? excludeIngredients : excludeIngredients.split(',').map((i: string) => i.trim())) : [],
            preparationTime: parsedPreparationTime,
            isVegetarian: Boolean(isVegetarian),
            isVegan: Boolean(isVegan),
            isGlutenFree: Boolean(isGlutenFree),
            isDairyFree: Boolean(isDairyFree),
            isKeto: Boolean(isKeto),
            isLowCarb: Boolean(isLowCarb),
            isHighProtein: Boolean(isHighProtein),
            isLowFat: Boolean(isLowFat)
        });

        // Check if the generation was successful
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.message || "Failed to generate meal plan",
                error: result.error
            });
        }

        // Return the formatted response
        return res.status(200).json({
            success: true,
            message: "Your meal plan is ready",
            data: {
                meal_plan: result.data?.meal_plan
            }
        });
    } catch (error) {
        console.error('Error generating meal plan:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate meal plan",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
    }
};

export const ChatWithAI= async(req:Request,res:Response)=>{
    const { message } = req.body;

    if(!message) return res.status(400).json({message:"Please provide a message to send"});
    try {
        const reply = await chat(message);
        res.status(200).json({message: reply.reply});
    } catch (error) {
        console.log("error in chat controller",error);
        res.status(500).json({message:"Something went wrong"});
    }
}


export const recipeGenerator = async (req: Request, res: Response) => {
    try {
        const { ingredients, fitnessGoal } = req.body;

        // Validate required fields
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0 || !fitnessGoal) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                requiredFields: {
                    ingredients: "Array of ingredients",
                    fitnessGoal: "Fitness goal (e.g., weight loss, muscle gain)"
                }
            });
        }

        // Generate the recipe
        const recipe = await generateRecipe(ingredients, fitnessGoal);

        // Return the formatted response
        return res.status(200).json({
            success: true,
            message: "Recipe generated successfully",
            data: recipe
        });

    } catch (error) {
        console.error('Error generating recipe:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate recipe",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
    }
};

export const saveMealPlan = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { name, description, dailyCalories, weeklyPlan } = req.body;

    const savedPlan = await SavedMealPlan.create({
      user: req.user._id,
      name,
      description,
      dailyCalories,
      weeklyPlan
    });

    return res.status(201).json({
      success: true,
      message: 'Meal plan saved successfully',
      data: savedPlan
    });
  } catch (error) {
    console.error('Error saving meal plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save meal plan',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const saveWorkoutPlan = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { name, description, schedule, dailyWorkouts, warmUp, coolDown } = req.body;

    const savedPlan = await SavedWorkoutPlan.create({
      user: req.user._id,
      name,
      description,
      schedule,
      dailyWorkouts,
      warmUp,
      coolDown
    });

    return res.status(201).json({
      success: true,
      message: 'Workout plan saved successfully',
      data: savedPlan
    });
  } catch (error) {
    console.error('Error saving workout plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save workout plan',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getSavedMealPlans = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const savedPlans = await SavedMealPlan.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: savedPlans
    });
  } catch (error) {
    console.error('Error fetching saved meal plans:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch saved meal plans',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getSavedWorkoutPlans = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const savedPlans = await SavedWorkoutPlan.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: savedPlans
    });
  } catch (error) {
    console.error('Error fetching saved workout plans:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch saved workout plans',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getSavedMealPlanById = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const savedPlan = await SavedMealPlan.findOne({ 
      _id: id,
      user: req.user._id 
    });

    if (!savedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: savedPlan
    });
  } catch (error) {
    console.error('Error fetching saved meal plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch saved meal plan',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getSavedWorkoutPlanById = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const savedPlan = await SavedWorkoutPlan.findOne({ 
      _id: id,
      user: req.user._id 
    });

    if (!savedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: savedPlan
    });
  } catch (error) {
    console.error('Error fetching saved workout plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch saved workout plan',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
export const getUserSavedWorkoutPlans = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const savedPlans = await SavedWorkoutPlan.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: savedPlans
    });
  } catch (error) {
    console.error('Error fetching saved workout plans:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch saved workout plans',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
  
export const getUserSavedMealPlans = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const savedPlans = await SavedMealPlan.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: savedPlans
    });
  } catch (error) {
    console.error('Error fetching saved meal plans:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch saved meal plans',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getUserSavedWorkoutPlan = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const savedPlans = await SavedWorkoutPlan.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: savedPlans
    });
  } catch (error) {
    console.error('Error fetching saved workout plans:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch saved workout plans',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};  

export const getUserSavedMealPlan = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    const { id } = req.params;
    const savedPlans = await SavedMealPlan.find({ _id: id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: savedPlans
    });
  } catch (error) {
    console.error('Error fetching saved meal plans:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch saved meal plans',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};