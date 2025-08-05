import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../App';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import LoadingSpinner from '../components/LoadingSpinner';
import { RefreshCw, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  _id: string;
  content: string;
  image?: string;
  author: {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
  };
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      profilePicture: string;
    };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api'
  : 'https://ciaan-cyber-interntask.onrender.com/api';
const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [newPostNotification, setNewPostNotification] = useState(false);

  useEffect(() => {
    fetchPosts();
    // Simulate real-time notifications (e.g., new posts)
    const notificationInterval = setInterval(() => {
      setNewPostNotification(true);
      setTimeout(() => setNewPostNotification(false), 3000);
    }, 30000);
    return () => clearInterval(notificationInterval);
  }, []);

  const fetchPosts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data.posts || []);
      setError('');
    } catch (err: any) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = () => {
    fetchPosts(true);
    setNewPostNotification(false);
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setNewPostNotification(true);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = (deletedPostId: string) => {
    setPosts(posts.filter(post => post._id !== deletedPostId));
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen pt-8 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl shadow-lg p-6 mb-8 border transition-colors ${
            isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-white/20'
          } backdrop-blur-md`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${
              isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}>
              <span className="text-white text-lg font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Welcome back, {user?.name}!
              </h1>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                What's on your mind today?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <CreatePost onPostCreated={handlePostCreated} />
        </motion.div>

        {/* Feed Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>Latest Posts</h2>
          <div className="flex items-center space-x-4">
            {newPostNotification && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative"
              >
                <Bell className={`h-5 w-5 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </motion.div>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isDarkMode
                  ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700 disabled:opacity-50'
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50'
              }`}
              aria-label={refreshing ? 'Refreshing posts' : 'Refresh posts'}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 ${
              isDarkMode ? 'bg-red-900/30 border-red-800 text-red-200' : ''
            }`}
          >
            {error}
          </motion.div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl shadow-lg p-12 text-center border transition-colors ${
                isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-white/20'
              } backdrop-blur-md`}
            >
              <div className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} aria-hidden="true">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>No posts yet</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Be the first to share something with the community!
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PostCard
                    post={post}
                    onPostUpdate={handlePostUpdate}
                    onPostDelete={handlePostDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;