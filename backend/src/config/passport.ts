import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request } from 'express';
import User, { IUser } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

// Type definitions for passport callback functions
type DoneCallback = (error: any, user?: any, info?: any) => void;

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

passport.serializeUser((user: IUser, done: DoneCallback) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: DoneCallback) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Check if required environment variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing required Google OAuth environment variables');
  process.exit(1);
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (accessToken: string, refreshToken: string, profile: any, done: DoneCallback) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create new user
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
            authProvider: 'google',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport; 