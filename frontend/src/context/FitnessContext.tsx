import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

// Define interfaces for the meal and workout plans
interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  image: string;
  ingredients: string[];
  instructions: string;
}

interface DailyMeals {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  snacks: Meal[];
}

interface MealPlan {
  _id: string;
  name: string;
  description: string;
  dailyCalories: number;
  weeklyPlan: {
    [key: string]: DailyMeals;
  };
  createdAt: string;
  user: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  description: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
}

interface DailyWorkout {
  warmUp: Exercise[];
  mainWorkout: Exercise[];
  coolDown: Exercise[];
}

interface WorkoutPlan {
  _id: string;
  name: string;
  description: string;
  schedule: {
    [key: string]: DailyWorkout;
  };
  createdAt: string;
  user: string;
}

interface FitnessContextType {
  mealPlans: MealPlan[];
  workoutPlans: WorkoutPlan[];
  selectedMealPlan: MealPlan | null;
  selectedWorkoutPlan: WorkoutPlan | null;
  loadMealPlans: () => Promise<void>;
  loadWorkoutPlans: () => Promise<void>;
  getMealPlanById: (id: string) => MealPlan | null;
  getWorkoutPlanById: (id: string) => WorkoutPlan | null;
  setSelectedMealPlan: (plan: MealPlan | null) => void;
  setSelectedWorkoutPlan: (plan: WorkoutPlan | null) => void;
  loading: boolean;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export function FitnessProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load meal plans from API
  const loadMealPlans = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/saved-meal-plans`, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setMealPlans(response.data.data);
      }
    } catch (error) {
      console.error('Error loading meal plans:', error);
      toast.error('Failed to load meal plans');
    } finally {
      setLoading(false);
    }
  };

  // Load workout plans from API
  const loadWorkoutPlans = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/saved-workout-plans`, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setWorkoutPlans(response.data.data);
      }
    } catch (error) {
      console.error('Error loading workout plans:', error);
      toast.error('Failed to load workout plans');
    } finally {
      setLoading(false);
    }
  };

  // Get meal plan by ID from local state
  const getMealPlanById = (id: string): MealPlan | null => {
    const plan = mealPlans.find(plan => plan._id === id);
    if (plan) {
      setSelectedMealPlan(plan);
      return plan;
    }
    return null;
  };

  // Get workout plan by ID from local state
  const getWorkoutPlanById = (id: string): WorkoutPlan | null => {
    const plan = workoutPlans.find(plan => plan._id === id);
    if (plan) {
      setSelectedWorkoutPlan(plan);
      return plan;
    }
    return null;
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadMealPlans();
      loadWorkoutPlans();
    }
  }, [isAuthenticated]);

  return (
    <FitnessContext.Provider value={{
      mealPlans,
      workoutPlans,
      selectedMealPlan,
      selectedWorkoutPlan,
      loadMealPlans,
      loadWorkoutPlans,
      getMealPlanById,
      getWorkoutPlanById,
      setSelectedMealPlan,
      setSelectedWorkoutPlan,
      loading
    }}>
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
} 