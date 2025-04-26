import express from 'express';
import { login, register } from '../controllers/auth.controller';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);


export default router; 