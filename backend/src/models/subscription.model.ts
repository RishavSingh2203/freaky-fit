import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface ISubscription extends Document {
  user: IUser['_id'];
  plan: 'FREE' | 'PREMIUM';
  startDate: Date;
  endDate: Date;
  active: boolean;
  paymentId?: string;
  orderId?: string;
  workoutPlansGenerated: number;
  mealPlansGenerated: number;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: String,
      enum: ['FREE', 'PREMIUM'],
      default: 'FREE',
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    workoutPlansGenerated: {
      type: Number,
      default: 0,
    },
    mealPlansGenerated: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
