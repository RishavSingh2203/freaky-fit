"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
// Check if Razorpay keys are available in environment variables
const hasValidKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;
if (!hasValidKeys) {
    console.error('WARNING: Razorpay API keys are missing in environment variables');
}
// Initialize Razorpay with API keys
const instance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});
exports.default = instance;
