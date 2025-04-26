import { Request, Response } from 'express';
import User from '../models/user.model';
import { z } from 'zod';
import SavedWorkoutPlan from '../models/SavedWorkoutPlan';

// Validation schema for user update
const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
});

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { name, email } = req.body;

    // Check if email is already taken
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Email already taken' });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name, email } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 

export const getUserSavedWorkoutPlans = async (req: Request, res: Response) => {
  try {
    const  id = req.user._id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const savedWorkoutPlans = await SavedWorkoutPlan.find({ user: id });
    res.json(savedWorkoutPlans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

