import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setAuthState, forceInitUser, checkAuthStatus } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('AuthCallback: Starting OAuth callback handling');
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
          console.log('AuthCallback: Token received, setting in localStorage and axios headers');
          // Set the token in localStorage
          localStorage.setItem('token', token);
          
          // Set token in axios headers immediately
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          try {
            // Fetch user data from the API
            console.log('AuthCallback: Fetching user data from API');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/status`);
            
            if (response.data.isAuthenticated && response.data.user) {
              // Store user data
              const user = response.data.user;
              console.log('AuthCallback: User authenticated successfully:', user);
              localStorage.setItem('user', JSON.stringify(user));
              
              // Update auth state in context - use both methods to ensure state is properly set
              setAuthState(true, user);
              const initResult = forceInitUser();
              console.log('AuthCallback: Force init user result:', initResult);
              
              // Ensure auth state is properly set by checking it
              const authStatus = await checkAuthStatus();
              console.log('AuthCallback: Auth status check result:', authStatus);
              
              toast.success('Login successful!');
              
              // Role-based redirection with a slight delay to ensure state is updated
              setTimeout(() => {
                if (user.role === 'ADMIN') {
                  console.log('AuthCallback: Redirecting to admin dashboard');
                  navigate('/admin/dashboard');
                } else if (user.role === 'TRAINER') {
                  console.log('AuthCallback: Redirecting to trainer dashboard');
                  navigate('/trainer/dashboard');
                } else {
                  console.log('AuthCallback: Redirecting to home page');
                  navigate('/home');
                }
              }, 500); // Small delay to ensure state updates are processed
            } else {
              // Authentication failed
              console.error('AuthCallback: API returned not authenticated');
              setError('Authentication failed');
              setAuthState(false, null);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              toast.error('Authentication failed');
              setTimeout(() => navigate('/login'), 2000);
            }
          } catch (apiError) {
            console.error('AuthCallback: Error fetching user data:', apiError);
            setError('Error fetching user data');
            setAuthState(false, null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.error('Error fetching user data');
            setTimeout(() => navigate('/login'), 2000);
          }
        } else {
          console.error('AuthCallback: No token received');
          setError('No authentication token received');
          setAuthState(false, null);
          toast.error('No authentication token received');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error('AuthCallback: Error in auth callback:', error);
        setError('Authentication error occurred');
        setAuthState(false, null);
        toast.error('Authentication error occurred');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleCallback();
  }, [navigate, setAuthState]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        {error ? (
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-red-500">Authentication Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="mt-2">Redirecting to login page...</p>
          </div>
        ) : (
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Completing login...</h2>
            <p className="text-muted-foreground">Please wait while we authenticate you.</p>
          </div>
        )}
      </div>
    </div>
  );
}