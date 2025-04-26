"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Authentication middleware
const protect = async (req, res, next) => {
    try {
        let token;
        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Check if user exists
        const user = await user_model_1.default.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        // Set user in request
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};
exports.protect = protect;
// Admin middleware
const admin = async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        const user = await user_model_1.default.findById(req.user._id);
        if ((user === null || user === void 0 ? void 0 : user.role) === 'ADMIN') {
            next();
        }
        else {
            res.status(403).json({ message: 'Not authorized as admin' });
        }
    }
    catch (error) {
        res.status(401).json({ message: 'Not authorized, user not found' });
    }
};
exports.admin = admin;
