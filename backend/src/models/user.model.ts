import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN' | 'TRAINER';
  googleId?: string;
  avatar?: string;
  authProvider: 'local' | 'google';
  createdAt: Date;
  updatedAt: Date;
  specialization?: string;
  rating?: number;
  hourlyRate?: number;
  bio?: string;
  subscriptionStatus?: 'FREE' | 'PREMIUM';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [function(this: IUser) {
        return this.authProvider === 'local';
      }, 'Password is required for local authentication'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    role: { 
      type: String, 
      enum: ['ADMIN', 'Trainer', 'USER'],
      default: 'USER'
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
      required: true,
    },
    specialization: { type: String },
    rating: { type: Number, default: 0 },
    hourlyRate: { type: Number },
    bio: { type: String },
    subscriptionStatus: {
      type: String,
      enum: ['FREE', 'PREMIUM'],
      default: 'FREE'
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.authProvider !== 'local') return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (this.authProvider !== 'local') return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;