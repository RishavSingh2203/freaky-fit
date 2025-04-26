import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

interface JwtPayload {
  id: string;
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Authentication middleware
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token:string;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Admin middleware
export const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    const user = await User.findById(req.user._id);
    if (user?.role === 'ADMIN') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as admin' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, user not found' });
  }
}; 