import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'TRAINER' | 'USER';
  avatar?: string;
  specialization?: string;
  hourlyRate?: number;
  bio?: string;
  subscriptionStatus?: 'FREE' | 'PREMIUM';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['ADMIN', 'TRAINER', 'USER'],
    default: 'USER' 
  },
  avatar: { 
    type: String 
  },
  specialization: { 
    type: String 
  },
  hourlyRate: { 
    type: Number 
  },
  bio: { 
    type: String 
  },
  subscriptionStatus: {
    type: String,
    enum: ['FREE', 'PREMIUM'],
    default: 'FREE'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model<IUser>('User', userSchema); 