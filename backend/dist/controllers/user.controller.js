"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSavedWorkoutPlans = exports.updateUserProfile = exports.getUserProfile = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const zod_1 = require("zod");
const SavedWorkoutPlan_1 = __importDefault(require("../models/SavedWorkoutPlan"));
// Validation schema for user update
const updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
});
// Get user profile
const getUserProfile = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ message: 'User not found' });
        }
        const user = await user_model_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserProfile = getUserProfile;
// Update user profile
const updateUserProfile = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ message: 'User not found' });
        }
        const { name, email } = req.body;
        // Check if email is already taken
        if (email) {
            const existingUser = await user_model_1.default.findOne({ email });
            if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
                return res.status(400).json({ message: 'Email already taken' });
            }
        }
        // Update user
        const updatedUser = await user_model_1.default.findByIdAndUpdate(req.user._id, { $set: { name, email } }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateUserProfile = updateUserProfile;
const getUserSavedWorkoutPlans = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await user_model_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const savedWorkoutPlans = await SavedWorkoutPlan_1.default.find({ user: id });
        res.json(savedWorkoutPlans);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserSavedWorkoutPlans = getUserSavedWorkoutPlans;
