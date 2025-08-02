import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import LoadingSpinner from './components/LoadingSpinner';
import { Moon, Sun } from 'lucide-react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { isDarkMode } = useTheme();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' 
        : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'
    }`}>
      {user && <Navbar />}
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/home" /> : <LandingPage />} 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/home" /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/home" /> : <RegisterPage />} 
        />
        <Route 
          path="/home" 
          element={user ? <HomePage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/profile/:id" 
          element={user ? <ProfilePage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Navigate to={`/profile/${user.id}`} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/explore" 
          element={user ? <ExplorePage /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeContext.Provider>
  );
};

export default App;