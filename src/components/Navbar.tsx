import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../App';
import { Home, Search, User, LogOut, Menu, X, Linkedin as LinkedIn, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/home', icon: Home, label: 'Home', ariaLabel: 'Navigate to Home' },
    { path: '/explore', icon: Search, label: 'Explore', ariaLabel: 'Navigate to Explore' },
    {
      path: user?.id ? `/profile/${user.id}` : '#',
      icon: User,
      label: 'Profile',
      ariaLabel: 'View your profile',
      hasNotification: false,
      disabled: !user?.id || !isAuthenticated,
    },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700 text-gray-100' 
          : 'bg-white/80 border-gray-200 text-gray-900'
      } backdrop-blur-md shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2 group" aria-label="CommunityHub Home">
            <div className={`p-2 rounded-lg transition-colors group-hover:scale-105 ${
              isDarkMode ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-blue-600 group-hover:bg-blue-700'
            }`}>
              <LinkedIn className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-bold hidden sm:block ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>CommunityHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, icon: Icon, label, ariaLabel, hasNotification, disabled }) => (
              <Link
                key={path}
                to={disabled ? '#' : path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 relative ${
                  disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : isActive(path)
                      ? isDarkMode
                        ? 'bg-blue-700 text-blue-200'
                        : 'bg-blue-100 text-blue-600'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                }`}
                aria-label={ariaLabel}
                aria-disabled={disabled}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
                {hasNotification && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors hover:scale-105 ${
                isDarkMode
                  ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-yellow-600 hover:bg-gray-100'
              }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user?.id && isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                  isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}>
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {user?.name}
                </span>
              </div>
            ) : null}
            <button
              onClick={handleLogout}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isDarkMode
                  ? 'text-gray-300 hover:text-red-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors hover:scale-105 ${
              isDarkMode
                ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={`md:hidden border-t transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
          } backdrop-blur-md`}
        >
          <div className="px-4 py-3 space-y-3">
            {navItems.map(({ path, icon: Icon, label, ariaLabel, hasNotification, disabled }) => (
              <Link
                key={path}
                to={disabled ? '#' : path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 relative ${
                  disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : isActive(path)
                      ? isDarkMode
                        ? 'bg-blue-700 text-blue-200'
                        : 'bg-blue-100 text-blue-600'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                }`}
                aria-label={ariaLabel}
                aria-disabled={disabled}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
                {hasNotification && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 w-full ${
                isDarkMode
                  ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-yellow-600 hover:bg-gray-100'
              }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <div className={`border-t pt-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {user?.id && isAuthenticated ? (
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}>
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {user?.name}
                  </span>
                </div>
              ) : null}
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-3 px-3 py-2 w-full rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-red-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;