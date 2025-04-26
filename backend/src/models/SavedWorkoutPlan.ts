import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface ISavedWorkoutPlan extends Document {
  user: IUser['_id'];
  name: string;
  description: string;
  schedule: {
    [key: string]: string;
  };
  dailyWorkouts: {
    [key: string]: {
      exercises: Array<{
        name: string;
        sets: number;
        reps: string;
        description: string;
        gifUrl: string;
      }>;
    };
  };
  warmUp: {
    description: string;
    exercises: Array<{
      name: string;
      duration: string;
      description: string;
      gifUrl: string;
    }>;
  };
  coolDown: {
    description: string;
    exercises: Array<{
      name: string;
      duration: string;
      description: string;
      gifUrl: string;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const savedWorkoutPlanSchema = new Schema<ISavedWorkoutPlan>(
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
    schedule: {
      type: Map,
      of: String,
      required: true,
    },
    dailyWorkouts: {
      type: Schema.Types.Mixed,
      required: true,
    },
    warmUp: {
      description: {
        type: String,
        required: true,
      },
      exercises: [{
        name: String,
        duration: String,
        description: String,
        gifUrl: String,
      }],
    },
    coolDown: {
      description: {
        type: String,
        required: true,
      },
      exercises: [{
        name: String,
        duration: String,
        description: String,
        gifUrl: String,
      }],
    },
  },
  {
    timestamps: true,
  }
);

const SavedWorkoutPlan = mongoose.model<ISavedWorkoutPlan>('SavedWorkoutPlan', savedWorkoutPlanSchema);

export default SavedWorkoutPlan; 