import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../App';
import { Search, Users, UserPlus, Filter } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  followers: any[];
  following: any[];
  postsCount: number;
}

const ExplorePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'popular' | 'newest'>('all');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm) {
        searchUsers();
      } else {
        fetchUsers();
      }
    }, 500);
    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filter]);

  const fetchUsers = useCallback(async () => {
    try {
      setSearchLoading(true);
      let url = 'http://localhost:5000/api/users';
      if (filter === 'popular') url += '?sort=followers';
      if (filter === 'newest') url += '?sort=createdAt';
      const response = await axios.get(url);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [filter]);

  const searchUsers = useCallback(async () => {
    try {
      setSearchLoading(true);
      let url = `http://localhost:5000/api/users?search=${encodeURIComponent(searchTerm)}`;
      if (filter === 'popular') url += '&sort=followers';
      if (filter === 'newest') url += '&sort=createdAt';
      const response = await axios.get(url);
      setUsers(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  }, [searchTerm, filter]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen pt-8 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>Explore Community</h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Discover and connect with amazing professionals in our community
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className={`block w-full pl-10 pr-3 py-4 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-lg text-lg placeholder-gray-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' 
                    : 'bg-white/80 border-gray-300 text-gray-900'
                } backdrop-blur-md`}
                aria-label="Search for users"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'popular' | 'newest')}
                className={`px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-100' 
                    : 'bg-white/80 border-gray-300 text-gray-900'
                }`}
                aria-label="Filter users"
              >
                <option value="all">All Users</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {searchLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${
              isDarkMode ? 'border-blue-400' : 'border-blue-600'
            }`} />
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Searching...</p>
          </motion.div>
        )}

        {/* Users Grid */}
        {!searchLoading && (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`rounded-2xl shadow-lg border p-6 transition-colors transform hover:-translate-y-2 hover:shadow-xl ${
                    isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-white/20'
                  } backdrop-blur-md`}
                >
                  {/* User Avatar */}
                  <div className="text-center mb-4">
                    <Link to={`/profile/${user._id}`} aria-label={`View ${user.name}'s profile`}>
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 hover:scale-105 transition-transform shadow-lg ${
                        isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </Link>
                    <Link
                      to={`/profile/${user._id}`}
                      className={`text-xl font-bold mb-1 block transition-colors hover:text-blue-600 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      {user.name}
                    </Link>
                    <p className={isDarkMode ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>{user.email}</p>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className={`text-center mb-4 line-clamp-3 leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {user.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex justify-center space-x-6 mb-4">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {user.postsCount}
                      </div>
                      <div className={isDarkMode ? 'text-gray-400 text-xs' : 'text-gray-600 text-xs'}>Posts</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {user.followers.length}
                      </div>
                      <div className={isDarkMode ? 'text-gray-400 text-xs' : 'text-gray-600 text-xs'}>Followers</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {user.following.length}
                      </div>
                      <div className={isDarkMode ? 'text-gray-400 text-xs' : 'text-gray-600 text-xs'}>Following</div>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Link
                    to={`/profile/${user._id}`}
                    className={`w-full py-2 px-4 rounded-lg font-semibold text-center block transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    }`}
                    aria-label={`View ${user.name}'s profile`}
                  >
                    View Profile
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* No Results */}
        {!searchLoading && users.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {searchTerm ? 'No users found' : 'No users to show'}
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to join our community!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;