"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const router = express_1.default.Router();
// Validation schema for updating user role
const updateUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['ADMIN', 'TRAINER', 'USER']),
});
// Validation schema for updating trainer info
const updateTrainerInfoSchema = zod_1.z.object({
    specialization: zod_1.z.string().min(1, 'Specialization is required'),
    hourlyRate: zod_1.z.number().min(0, 'Hourly rate must be positive'),
    bio: zod_1.z.string().min(1, 'Bio is required'),
});
// Get all trainers
router.get('/trainers', auth_1.auth, (0, auth_1.checkRole)(['ADMIN']), async (req, res) => {
    try {
        const trainers = await User_1.User.find({ role: 'TRAINER' })
            .select('-password')
            .sort({ name: 1 });
        res.json(trainers);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Add a new trainer
router.post('/trainers', auth_1.auth, (0, auth_1.checkRole)(['ADMIN']), async (req, res) => {
    try {
        const { name, email, password, specialization, hourlyRate, bio } = req.body;
        // Check if email already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create new trainer
        const trainer = new User_1.User({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Update trainer details
router.patch('/trainers/:trainerId', auth_1.auth, (0, auth_1.checkRole)(['ADMIN']), async (req, res) => {
    try {
        const { name, specialization, hourlyRate, bio, isVerified } = req.body;
        const trainer = await User_1.User.findOne({
            _id: req.params.trainerId,
            role: 'TRAINER'
        });
        if (!trainer) {
            return res.status(404).json({ error: 'Trainer not found' });
        }
        // Update fields
        if (name)
            trainer.name = name;
        if (specialization)
            trainer.specialization = specialization;
        if (hourlyRate)
            trainer.hourlyRate = hourlyRate;
        if (bio)
            trainer.bio = bio;
        if (typeof isVerified === 'boolean') {
            // Add isVerified as a custom property if needed
            trainer.isVerified = isVerified;
        }
        await trainer.save();
        // Remove password from response
        const trainerResponse = trainer.toObject();
        delete trainerResponse.password;
        res.json(trainerResponse);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Delete a trainer
router.delete('/trainers/:trainerId', auth_1.auth, (0, auth_1.checkRole)(['ADMIN']), async (req, res) => {
    try {
        const trainer = await User_1.User.findOne({
            _id: req.params.trainerId,
            role: 'TRAINER'
        });
        if (!trainer) {
            return res.status(404).json({ error: 'Trainer not found' });
        }
        await User_1.User.deleteOne({ _id: trainer._id });
        res.json({ message: 'Trainer deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Get all users (Admin only)
router.get('/users', auth_1.auth, (0, auth_1.checkRole)(['ADMIN']), async (req, res) => {
    try {
        const users = await User_1.User.find()
            .select('-password')
            .sort({ name: 1 });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Update user role (Admin only)
router.patch('/users/:userId/role', auth_1.auth, (0, auth_1.checkRole)(['ADMIN']), async (req, res) => {
    try {
        const { userId } = req.params;
        const validatedData = updateUserRoleSchema.parse(req.body);
        const user = await User_1.User.findById(userId);
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: 'Server error' });
    }
});
// Update trainer information (Admin only)
router.patch('/trainers/:trainerId/info', auth_1.auth, (0, auth_1.checkRole)(['ADMIN']), async (req, res) => {
    try {
        const { trainerId } = req.params;
        const validatedData = updateTrainerInfoSchema.parse(req.body);
        const trainer = await User_1.User.findOne({
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
