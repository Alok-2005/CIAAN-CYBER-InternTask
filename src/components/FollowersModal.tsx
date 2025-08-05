import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../App';
import { X, UserPlus, UserMinus, Users, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
  followers: any[];
  following: any[];
  postsCount: number;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: 'followers' | 'following';
  title: string;
}

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api'
  : 'https://ciaan-cyber-interntask.onrender.com/api';

const FollowersModal: React.FC<FollowersModalProps> = ({ 
  isOpen, 
  onClose, 
  userId, 
  type, 
  title 
}) => {
  const { user: currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [followingStatus, setFollowingStatus] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (isOpen && userId) {
      fetchUsers();
    }
  }, [isOpen, userId, type]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      const userData = response.data;
      const usersList = type === 'followers' ? userData.followers : userData.following;
      setUsers(usersList || []);
      
      // Check following status for each user
      const status: {[key: string]: boolean} = {};
      usersList.forEach((user: User) => {
        status[user._id] = currentUser?.following?.includes(user._id) || false;
      });
      setFollowingStatus(status);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    try {
      const response = await axios.post(`${API_URL}/users/${targetUserId}/follow`);
      setFollowingStatus(prev => ({
        ...prev,
        [targetUserId]: response.data.isFollowing
      }));
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl transition-colors ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Users className={`h-6 w-6 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {title} ({users.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors hover:scale-105 ${
              isDarkMode 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 pb-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${
                isDarkMode ? 'border-blue-400' : 'border-blue-600'
              }`} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className={`w-16 h-16 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {searchTerm ? 'No users found' : `No ${type} yet`}
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {searchTerm ? 'Try a different search term' : `This user has no ${type} yet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-colors hover:scale-[1.02] ${
                      isDarkMode 
                        ? 'bg-gray-700/50 hover:bg-gray-700' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <Link to={`/profile/${user._id}`} onClick={onClose}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-transform hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}>
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={`${user.name}'s profile`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/profile/${user._id}`}
                        onClick={onClose}
                        className={`font-semibold hover:underline block truncate ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {user.name}
                      </Link>
                      <p className={`text-sm truncate ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {user.email}
                      </p>
                      {user.bio && (
                        <p className={`text-sm mt-1 line-clamp-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {user.bio}
                        </p>
                      )}
                      <div className={`flex items-center space-x-4 mt-2 text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <span>{user.postsCount} posts</span>
                        <span>{user.followers.length} followers</span>
                        <span>{user.following.length} following</span>
                      </div>
                    </div>

                    {currentUser?.id !== user._id && (
                      <button
                        onClick={() => handleFollow(user._id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 ${
                          followingStatus[user._id]
                            ? isDarkMode 
                              ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : isDarkMode 
                              ? 'bg-blue-500 text-white hover:bg-blue-600' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {followingStatus[user._id] ? (
                          <>
                            <UserMinus className="h-4 w-4" />
                            <span>Unfollow</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FollowersModal;