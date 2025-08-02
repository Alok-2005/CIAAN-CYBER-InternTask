import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../App';  // Added import for theme
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Edit,
  Mail,
  Calendar,
  MessageCircle
} from 'lucide-react';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
  followers: any[];
  following: any[];
  postsCount: number;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const { isDarkMode } = useTheme();  // Added for dark mode
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: '', bio: '' });

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    if (id) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${id}`);
      setProfile(response.data);
      setIsFollowing(response.data.followers.some((follower: any) => follower._id === currentUser?.id));
      setEditData({ name: response.data.name, bio: response.data.bio });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${id}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/users/${id}/follow`);
      setIsFollowing(response.data.isFollowing);
      
      // Update follower count
      if (profile) {
        setProfile({
          ...profile,
          followers: response.data.isFollowing 
            ? [...profile.followers, currentUser]
            : profile.followers.filter((f: any) => f._id !== currentUser?.id)
        });
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/api/users/profile', editData);
      setProfile({ ...profile!, ...editData });
      updateUser(editData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePostUpdate = (updatedPost: any) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = (deletedPostId: string) => {
    setPosts(posts.filter(post => post._id !== deletedPostId));
    if (profile) {
      setProfile({ ...profile, postsCount: profile.postsCount - 1 });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors ${
        isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 to-blue-50'
      }`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-2 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>User not found</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>The profile you're looking for doesn't exist.</p>
          <Link to="/home" className={`${
            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          } font-medium mt-4 inline-block`}>
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-8 transition-colors ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className={`rounded-2xl shadow-lg p-8 mb-8 border transition-colors ${
          isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-white/20'
        } backdrop-blur-md`}>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg transition-colors ${
              isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}>
              {profile.name.charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className={`text-3xl font-bold mb-2 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>{profile.name}</h1>
                  <div className={`flex items-center space-x-4 mb-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {isOwnProfile ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isFollowing
                          ? isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isFollowing ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                      <span>{followLoading ? 'Loading...' : (isFollowing ? 'Unfollow' : 'Follow')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className={`text-lg mb-6 leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{profile.bio}</p>
              )}

              {/* Stats */}
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>{profile.postsCount}</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Posts</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>{profile.followers.length}</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Followers</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>{profile.following.length}</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {editMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl p-8 max-w-md w-full transition-colors ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>Edit Profile</h2>
              <form onSubmit={handleEditProfile} className="space-y-4">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bio" className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none transition-colors ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                      isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                      isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Posts */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {isOwnProfile ? 'Your Posts' : `${profile.name}'s Posts`}
          </h2>
          
          {posts.length === 0 ? (
            <div className={`rounded-2xl shadow-lg p-12 text-center border transition-colors ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-white/20'
            } backdrop-blur-md`}>
              <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>No posts yet</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {isOwnProfile ? "You haven't shared anything yet." : `${profile.name} hasn't shared anything yet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onPostUpdate={handlePostUpdate}
                  onPostDelete={handlePostDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
