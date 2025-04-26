"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = __importDefault(require("../models/user.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
// Check if required environment variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Missing required Google OAuth environment variables');
    process.exit(1);
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/auth/google/callback`,
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    var _a, _b, _c, _d;
    try {
        let user = await user_model_1.default.findOne({ googleId: profile.id });
        if (!user) {
            // Create new user
            user = await user_model_1.default.create({
                googleId: profile.id,
                email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
                name: profile.displayName,
                avatar: (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                authProvider: 'google',
            });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, undefined);
    }
}));
exports.default = passport_1.default;
