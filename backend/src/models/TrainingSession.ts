import mongoose, { Schema, Document, Types } from 'mongoose';
import { userSchema } from './user.model';

export interface ITrainingSession extends Document {
  trainer: Types.ObjectId;
  user: Types.ObjectId;
  date: Date;
  duration: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  meetingLink?: string;
  roomId?: string;
  scheduledTime?: Date;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const trainingSessionSchema = new Schema<ITrainingSession>({
  trainer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  duration: { 
    type: Number,
    default:1, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'],
    default: 'PENDING'
  },
  meetingLink: { type: String },
  roomId: { type: String },
  scheduledTime: { type: Date }
}, {
  timestamps: true
});

// Index for efficient querying
trainingSessionSchema.index({ trainer: 1, date: 1 });
trainingSessionSchema.index({ user: 1, date: 1 });
trainingSessionSchema.index({ status: 1 });

export const TrainingSession = mongoose.model<ITrainingSession>('TrainingSession', trainingSessionSchema); 