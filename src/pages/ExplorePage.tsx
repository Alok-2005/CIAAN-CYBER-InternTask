import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Users, UserPlus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

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
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm) {
        searchUsers();
      } else {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setSearchLoading(true);
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      setSearchLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users?search=${searchTerm}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Community</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and connect with amazing professionals in our community
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for people by name or email..."
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white/80 backdrop-blur-md shadow-lg text-lg placeholder-gray-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {searchLoading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Searching...</p>
          </div>
        )}

        {/* Users Grid */}
        {!searchLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* User Avatar */}
                <div className="text-center mb-4">
                  <Link to={`/profile/${user._id}`}>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 hover:scale-105 transition-transform shadow-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <Link
                    to={`/profile/${user._id}`}
                    className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors block mb-1"
                  >
                    {user.name}
                  </Link>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-gray-700 text-center mb-4 line-clamp-3 leading-relaxed">
                    {user.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex justify-center space-x-6 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{user.postsCount}</div>
                    <div className="text-gray-600 text-xs">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{user.followers.length}</div>
                    <div className="text-gray-600 text-xs">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{user.following.length}</div>
                    <div className="text-gray-600 text-xs">Following</div>
                  </div>
                </div>

                {/* View Profile Button */}
                <Link
                  to={`/profile/${user._id}`}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-center block transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!searchLoading && users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No users found' : 'No users to show'}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Be the first to join our community!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;