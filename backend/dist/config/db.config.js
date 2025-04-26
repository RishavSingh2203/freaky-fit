"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDb = async () => {
    try {
        const connection = await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log(`Database connected successfully: ${connection.connection.host}`);
    }
    catch (error) {
        console.log(`Error connecting to database: ${error}`);
        process.exit(1);
    }
};
exports.connectDb = connectDb;
exports.default = exports.connectDb;
