"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateZegoCloudConfig = exports.zegoCloudConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.zegoCloudConfig = {
    appID: process.env.ZEGO_APP_ID,
    serverSecret: process.env.ZEGO_SERVER_SECRET
};
const validateZegoCloudConfig = () => {
    if (!exports.zegoCloudConfig.appID) {
        console.error('ZEGO_APP_ID is not defined in environment variables');
        return false;
    }
    if (!exports.zegoCloudConfig.serverSecret) {
        console.error('ZEGO_SERVER_SECRET is not defined in environment variables');
        return false;
    }
    return true;
};
exports.validateZegoCloudConfig = validateZegoCloudConfig;
