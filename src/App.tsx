import React from 'react';
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

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;