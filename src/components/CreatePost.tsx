import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../App';
import { useNavigate } from 'react-router-dom';
import { Image, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface Post {
  _id: string;
  content: string;
  image?: string;
  author: {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
  };
  likes: Array<{ id: string; name: string }>;
  comments: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      profilePicture: string;
    };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
}

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api'
  : 'https://ciaan-cyber-interntask.onrender.com/api';
const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (!content.trim() && !image) {
      setError('Please provide content or an image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      onPostCreated(response.data);
      setContent('');
      setImage(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to create post');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl shadow-lg p-6 mb-6 border transition-colors ${
        isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-white/20'
      } backdrop-blur-md`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm transition-colors placeholder-gray-500 resize-none ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            rows={4}
            aria-label="Write a new post"
            disabled={loading}
          />
        </div>
        <div className="flex items-center space-x-4">
          <label
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-colors hover:scale-105 ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Image className="h-5 w-5" />
            <span>{image ? image.name : 'Add Image'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Upload an image"
              disabled={loading}
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || (!content.trim() && !image)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors shadow-lg ${
              isDarkMode
                ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-400'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-500'
            }`}
            aria-label="Create post"
          >
            <Send className="h-5 w-5" />
            <span>{loading ? 'Posting...' : 'Post'}</span>
          </motion.button>
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg ${
              isDarkMode ? 'bg-red-900/30 border-red-800 text-red-200' : ''
            }`}
            role="alert"
          >
            {error}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default CreatePost;