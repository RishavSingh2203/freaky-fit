import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { NetworkProvider } from '@/context/NetworkContext';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import MealGenerator from '@/pages/MealGenerator';
import WorkoutGenerator from '@/pages/WorkoutGenerator';
import VideoMeeting from '@/pages/VideoMeeting';
import TrainerDashboard from '@/pages/TrainerDashboard';
import MyBookings from '@/pages/MyBookings';
import { MealPlanView } from '@/pages/MealPlanView';
import { WorkoutPlanView } from '@/pages/WorkoutPlanView';
import Subscription from '@/pages/Subscription';
import { Toaster } from 'react-hot-toast';
import { PWAStatus } from '@/components/PWAStatus';
import { InstallPrompt } from '@/components/InstallPrompt';
import { Navbar } from '@/components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthCallback from '@/pages/AuthCallback';
import TrainerBooking from './pages/TrainerBooking';
import AiRecipe from './pages/AiRecipe';
import Assistant from './pages/Assistant';

export function AppRoutes() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NetworkProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage/>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/meal-generator" element={<MealGenerator />} />
                    <Route path="/workout-generator" element={<WorkoutGenerator />} />
                    <Route path="/video-meeting/:roomId" element={<VideoMeeting />} />
                    <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
                    <Route path="/book-trainer" element={<TrainerBooking />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/ai-recipe" element={<AiRecipe />} />
                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/video-meeting" element={<MyBookings />} />
                    <Route path="/meal-plan/:id" element={<MealPlanView />} />
                    <Route path="/ai-assistant" element={<Assistant/>} />
                    
                    <Route path="/workout-plan/:id" element={<WorkoutPlanView />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </main>
            </div>
            <PWAStatus />
            <InstallPrompt />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </AuthProvider>
        </NetworkProvider>
      </ThemeProvider>
    </Router>
  );
}