import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../App';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md p-8 rounded-2xl shadow-lg border transition-colors ${
          isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-white/20'
        } backdrop-blur-md`}
      >
        <div className="text-center mb-8">
          <div className={`inline-flex p-3 rounded-xl mb-4 ${
            isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
          }`}>
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>Join CommunityHub</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Create your account to start connecting
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 ${
              isDarkMode ? 'bg-red-900/30 border-red-800 text-red-200' : ''
            }`}
            role="alert"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm transition-colors placeholder-gray-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter your name"
              aria-required="true"
              aria-label="Full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm transition-colors placeholder-gray-500 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter your email"
              aria-required="true"
              aria-label="Email address"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm transition-colors placeholder-gray-500 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Create a password"
                aria-required="true"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                }`}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
              isDarkMode
                ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-400'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-500'
            }`}
            aria-label="Sign up"
          >
            <span>{loading ? 'Creating account...' : 'Sign Up'}</span>
            {loading && (
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
            )}
          </button>
        </form>

        <p className={`text-center mt-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <Link
            to="/login"
            className={`font-medium transition-colors hover:underline ${
              isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
            aria-label="Sign in to your account"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;