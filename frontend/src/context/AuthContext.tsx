import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  setAuthState: (isAuth: boolean, userData: User | null) => void;
  forceInitUser: () => { success: boolean, user: User | null };
}

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to force initialize user from localStorage
  const forceInitUser = (): { success: boolean, user: User | null } => {
    console.log("forceInitUser called - starting user initialization from localStorage");
    try {
      // Get user from localStorage
      const storedUserStr = localStorage.getItem('user');
      if (!storedUserStr) {
        console.log("No user found in localStorage during force init");
        return { success: false, user: null };
      }
      
      console.log("Raw user data from localStorage:", storedUserStr);
      
      const storedUser = JSON.parse(storedUserStr);
      if (!storedUser || (!storedUser._id && !storedUser.id)) {
        console.log("Invalid user data in localStorage during force init:", storedUser);
        return { success: false, user: null };
      }
      
      console.log("Force loading user from localStorage:", {
        _id: storedUser._id || storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        role: storedUser.role
      });
      
      // Set auth state (this updates React state)
      setAuthState(true, storedUser);
      console.log("Auth state updated to:", { isAuthenticated: true, user: storedUser });
      
      // Set token if available
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        console.log("Token found in localStorage, setting in context and axios headers");
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } else {
        console.log("No token found in localStorage, continuing without token");
      }
      
      // Check for direct access to updated user in context (can't be done immediately due to React state updates)
      console.log("Current context values after setAuthState:", { 
        isAuth: isAuthenticated, 
        hasUser: !!user, 
        userId: user?._id || user?.id
      });
      
      return { success: true, user: storedUser };
    } catch (e) {
      console.error("Error in forceInitUser:", e);
      return { success: false, user: null };
    }
  };

  // Add axios interceptor to include token in all requests
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Try to initialize user from localStorage right away
    if (!user) {
      const result = forceInitUser();
      console.log("Auto-initializing user result:", result.success, result.user ? "User loaded" : "No user loaded");
    }
  }, []);

  // Direct method to set auth state (useful for callbacks)
  const setAuthState = (isAuth: boolean, userData: User | null) => {
    setIsAuthenticated(isAuth);
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth state and token
      setAuthState(true, user);
      setToken(token);
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth state and token
      setAuthState(true, user);
      setToken(token);
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState(false, null);
    setToken(null);
    
    // Clear authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Show toast notification
    toast.success('Logged out successfully');
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('token');
      
      // Always try to load user from localStorage as a backup/fallback
      const storedUserJson = localStorage.getItem('user');
      let localStorageUser = null;
      
      if (storedUserJson) {
        try {
          localStorageUser = JSON.parse(storedUserJson);
          console.log("Loaded user from localStorage:", localStorageUser);
        } catch (e) {
          console.error("Failed to parse user from localStorage:", e);
        }
      }
      
      if (!storedToken) {
        setAuthState(false, null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
        setIsLoading(false);
        return false;
      }

      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken);
      
      try {
        const response = await axios.get(`${API_URL}/status`);
        
        if (response.data.isAuthenticated && response.data.user) {
          // Set auth state
          setAuthState(true, response.data.user);
          
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setIsLoading(false);
          return true;
        } else {
          // API says not authenticated but we have a token. 
          // If we have local user, use it as a fallback
          if (localStorageUser && localStorageUser._id) {
            console.log("API says not authenticated but using localStorage user as fallback");
            setAuthState(true, localStorageUser);
            setIsLoading(false);
            return true;
          }
          
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          
          // Set auth state and token
          setAuthState(false, null);
          setToken(null);
          
          setIsLoading(false);
          return false;
        }
      } catch (error) {
        console.error('Error communicating with auth API:', error);
        
        // API error but we have local user data - use it as a fallback
        if (localStorageUser && localStorageUser._id) {
          console.log("API error but using localStorage user as fallback");
          setAuthState(true, localStorageUser);
          setIsLoading(false);
          return true;
        }
        
        // No fallback available
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        
        setAuthState(false, null);
        setToken(null);
        
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error in checkAuthStatus:', error);
      
      // Try to get user from localStorage as last resort
      try {
        const storedUserJson = localStorage.getItem('user');
        if (storedUserJson) {
          const localUser = JSON.parse(storedUserJson);
          if (localUser && localUser._id) {
            console.log("Using localStorage user as final fallback");
            setAuthState(true, localUser);
            setIsLoading(false);
            return true;
          }
        }
      } catch (e) {
        console.error("Failed to parse user in final fallback:", e);
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      
      setAuthState(false, null);
      setToken(null);
      
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Don't render children until we've checked auth status
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold">Loading...</h2>
        <p className="text-muted-foreground">Please wait while we set up your experience.</p>
      </div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token,
      login, 
      register, 
      logout, 
      checkAuthStatus,
      setAuthState,
      forceInitUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}