import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const router = express.Router();

// Validation schema for updating user role
const updateUserRoleSchema = z.object({
  role: z.enum(['ADMIN', 'TRAINER', 'USER']),
});

// Validation schema for updating trainer info
const updateTrainerInfoSchema = z.object({
  specialization: z.string().min(1, 'Specialization is required'),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
  bio: z.string().min(1, 'Bio is required'),
});

// Get all trainers
router.get('/trainers', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const trainers = await User.find({ role: 'TRAINER' })
      .select('-password')
      .sort({ name: 1 });
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new trainer
router.post('/trainers', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const { name, email, password, specialization, hourlyRate, bio } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new trainer
    const trainer = new User({
      name,
      email,
      password: hashedPassword,
      role: 'TRAINER',
      specialization,
      hourlyRate,
      bio,
      isVerified: true // Admin-created trainers are automatically verified
    });

    await trainer.save();

    // Remove password from response
    const trainerResponse = trainer.toObject();
    delete trainerResponse.password;

    res.status(201).json(trainerResponse);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update trainer details
router.patch('/trainers/:trainerId', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const { name, specialization, hourlyRate, bio, isVerified } = req.body;

    const trainer = await User.findOne({
      _id: req.params.trainerId,
      role: 'TRAINER'
    });

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Update fields
    if (name) trainer.name = name;
    if (specialization) trainer.specialization = specialization;
    if (hourlyRate) trainer.hourlyRate = hourlyRate;
    if (bio) trainer.bio = bio;
    if (typeof isVerified === 'boolean') {
      // Add isVerified as a custom property if needed
      (trainer as any).isVerified = isVerified;
    }

    await trainer.save();

    // Remove password from response
    const trainerResponse = trainer.toObject();
    delete trainerResponse.password;

    res.json(trainerResponse);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a trainer
router.delete('/trainers/:trainerId', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const trainer = await User.findOne({
      _id: req.params.trainerId,
      role: 'TRAINER'
    });

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    await User.deleteOne({ _id: trainer._id });
    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/users', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user role (Admin only)
router.patch('/users/:userId/role', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const { userId } = req.params;
    const validatedData = updateUserRoleSchema.parse(req.body);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update role
    user.role = validatedData.role;
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update trainer information (Admin only)
router.patch('/trainers/:trainerId/info', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const { trainerId } = req.params;
    const validatedData = updateTrainerInfoSchema.parse(req.body);

    const trainer = await User.findOne({
      _id: trainerId,
      role: 'TRAINER'
    });

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Update trainer information
    trainer.specialization = validatedData.specialization;
    trainer.hourlyRate = validatedData.hourlyRate;
    trainer.bio = validatedData.bio;
    await trainer.save();

    // Remove password from response
    const trainerResponse = trainer.toObject();
    delete trainerResponse.password;

    res.json(trainerResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 