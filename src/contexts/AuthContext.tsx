import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
  followers: string[];
  following: string[];
  postsCount: number;
   token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, bio?: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api'
  : 'https://ciaan-cyber-interntask.onrender.com/api'
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          await fetchCurrentUser();
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          logout(); // Clear invalid token and user
        }
      } else {
        setLoading(false);
        setIsAuthenticated(false);
      }
    };

    initializeAuth();
  }, [token]);

  const fetchCurrentUser = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_URL}/api/auth/me`);
    const userData = response.data;
    if (!userData?.id) {
      throw new Error('Invalid user data: missing ID');
    }
    setUser({ ...userData, token });  // Add existing token to user object
  } catch (error: any) {
    console.error('Failed to fetch user:', error);
    throw new Error('Invalid or expired session');
  } finally {
    setLoading(false);
  }
};

const login = async (email: string, password: string) => {
  try {
    setLoading(true);
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const { token: newToken, user: userData } = response.data;
    if (!userData?.id) {
      throw new Error('Invalid user data: missing ID');
    }
    setToken(newToken);
    setUser({ ...userData, token: newToken });  // Add token to user object
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};


 const register = async (name: string, email: string, password: string, bio?: string) => {
  try {
    setLoading(true);
    const response = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, bio });
    const { token: newToken, user: userData } = response.data;
    if (!userData?.id) {
      throw new Error('Invalid user data: missing ID');
    }
    setToken(newToken);
    setUser({ ...userData, token: newToken });  // Add token to user object
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData: Partial<User>) => {
    if (user && userData.id && userData.id === user.id) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};