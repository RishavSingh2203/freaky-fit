import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include auth properties
declare global {
  namespace Express {
    interface Request {
      isAuthenticated(): boolean;
      logout(done: (err: any) => void): void;
    }
  }
}

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (user: any) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Google OAuth routes
router.get('/google', 
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })(req, res, next);
  }
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    if (req.user) {
      const token = generateToken(req.user);
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    } else {
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
  }
);

// Local authentication routes
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'local',
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Add this middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.json({ isAuthenticated: false, user: null });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return res.json({ isAuthenticated: false, user: null });
    }
    req.user = decoded;
    next();
  });
};

// Update the status route
router.get('/status', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
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
    } else {
      res.json({ isAuthenticated: false, user: null });
    }
  } catch (error) {
    res.json({ isAuthenticated: false, user: null });
  }
});

// Logout route
router.post('/logout', (req: Request, res: Response) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

export default router; 