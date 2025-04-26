"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.userSchema = new mongoose_1.Schema({
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
        required: [function () {
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
}, {
    timestamps: true,
});
// Hash password before saving
exports.userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.authProvider !== 'local')
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Compare password method
exports.userSchema.methods.comparePassword = async function (candidatePassword) {
    if (this.authProvider !== 'local')
        return false;
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
const User = mongoose_1.default.model('User', exports.userSchema);
exports.default = User;
