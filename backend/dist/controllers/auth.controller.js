"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const zod_1 = require("zod");
// Validation schemas
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// Generate JWT
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// Register a new user
const register = async (req, res) => {
    try {
        // Validate request body
        const validatedData = registerSchema.parse(req.body);
        // Check if user already exists
        const userExists = await user_model_1.default.findOne({ email: validatedData.email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user = await user_model_1.default.create({
            name: validatedData.name,
            email: validatedData.email,
            password: validatedData.password,
        });
        // Generate token
        const token = generateToken(user._id);
        // Send response
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
// Login user
const login = async (req, res) => {
    try {
        // Validate request body
        const validatedData = loginSchema.parse(req.body);
        // Find user
        const user = await user_model_1.default.findOne({ email: validatedData.email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isPasswordMatch = await user.comparePassword(validatedData.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate token
        const token = generateToken(user._id);
        // Send response
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
