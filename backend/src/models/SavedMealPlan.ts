import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface ISavedMealPlan extends Document {
  user: IUser['_id'];
  name: string;
  description: string;
  dailyCalories: number;
  weeklyPlan: {
    [key: string]: {
      breakfast: Array<{
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        prepTime: number;
        image: string;
        ingredients: string[];
        instructions: string;
      }>;
      lunch: Array<{
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        prepTime: number;
        image: string;
        ingredients: string[];
        instructions: string;
      }>;
      dinner: Array<{
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        prepTime: number;
        image: string;
        ingredients: string[];
        instructions: string;
      }>;
      snacks: Array<{
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        prepTime: number;
        image: string;
        ingredients: string[];
        instructions: string;
      }>;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const savedMealPlanSchema = new Schema<ISavedMealPlan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dailyCalories: {
      type: Number,
      required: true,
    },
    weeklyPlan: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SavedMealPlan = mongoose.model<ISavedMealPlan>('SavedMealPlan', savedMealPlanSchema);

export default SavedMealPlan; 