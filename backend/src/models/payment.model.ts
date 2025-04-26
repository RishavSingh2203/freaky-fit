import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IPayment extends Document {
  user: IUser['_id'];
  orderId: string;
  paymentId: string;
  signature?: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  method?: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
      required: true,
    },
    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
      default: 'created',
      required: true,
    },
    method: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
