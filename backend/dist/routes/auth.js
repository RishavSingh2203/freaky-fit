"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// Helper function to generate JWT token
const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};
// Google OAuth routes
router.get('/google', (req, res, next) => {
    passport_1.default.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })(req, res, next);
});
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    if (req.user) {
        const token = generateToken(req.user);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    }
    else {
        res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
});
// Local authentication routes
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user = await user_model_1.default.create({
            name,
            email,
            password,
            authProvider: 'local',
        });
        const token = generateToken(user);
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user and include password
        const user = await user_model_1.default.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user);
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Add this middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.json({ isAuthenticated: false, user: null });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({ isAuthenticated: false, user: null });
        }
        req.user = decoded;
        next();
    });
};
// Update the status route
router.get('/status', authenticateToken, async (req, res) => {
    var _a;
    try {
        const user = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (user) {
            res.json({
                isAuthenticated: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role
                }
            });
        }
        else {
            res.json({ isAuthenticated: false, user: null });
        }
    }
    catch (error) {
        res.json({ isAuthenticated: false, user: null });
    }
});
// Logout route
router.post('/logout', (req, res) => {
    req.logout(() => {
        res.json({ message: 'Logged out successfully' });
    });
});
exports.default = router;
