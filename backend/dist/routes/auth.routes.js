"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
// POST /api/auth/register - Register a new user
router.post('/register', auth_controller_1.register);
// POST /api/auth/login - Login user
router.post('/login', auth_controller_1.login);
exports.default = router;
