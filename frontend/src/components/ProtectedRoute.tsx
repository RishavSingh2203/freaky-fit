import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user, forceInitUser, checkAuthStatus } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Try to initialize user from localStorage if not authenticated
    if (!isAuthenticated) {
      console.log('ProtectedRoute: Not authenticated, trying to force init user');
      const result = forceInitUser();
      console.log('ProtectedRoute: Force init result:', result);
      
      // If that didn't work, check auth status
      if (!result.success) {
        console.log('ProtectedRoute: Force init unsuccessful, checking auth status');
        checkAuthStatus().then(status => {
          console.log('ProtectedRoute: Auth status check result:', status);
        });
      }
    } else {
      console.log('ProtectedRoute: User is authenticated:', user);
    }
  }, [isAuthenticated, location.pathname]);

  // If still not authenticated after our attempts, redirect to login
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Redirecting to login page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for role-based access
  const path = location.pathname;
  if (path.startsWith('/admin') && user?.role !== 'ADMIN') {
    console.log('ProtectedRoute: User does not have ADMIN role, redirecting to home');
    return <Navigate to="/home" replace />;
  }
  if (path.startsWith('/trainer') && user?.role !== 'TRAINER') {
    console.log('ProtectedRoute: User does not have TRAINER role, redirecting to home');
    return <Navigate to="/home" replace />;
  }

  console.log('ProtectedRoute: Access granted to:', path);
  return <Outlet />;
};

export default ProtectedRoute; 