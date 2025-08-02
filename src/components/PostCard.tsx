import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../App';
import { Heart, MessageCircle, Share2, Trash2, Send, Edit2 } from 'lucide-react';
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
  likes: Array<{ _id: string; name: string }>;
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      profilePicture: string;
    };
    text: string;
    createdAt: string;
    updatedAt?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface PostCardProps {
  post: Post;
  onPostUpdate: (updatedPost: Post) => void;
  onPostDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const isLiked = user ? post.likes.some(like => like._id === user.id) : false;  // Adjust if user.id is actually user._id
  const isOwnPost = user ? post.author._id === user.id : false;

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      onPostUpdate(response.data.post);
    } catch (err: any) {
      setError('Failed to update like');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${post._id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      onPostUpdate(response.data);
      setComment('');
      setShowComments(true);
    } catch (err: any) {
      setError('Failed to add comment');
    }
  };

  const handleEditComment = async (commentId: string) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${post._id}/comments/${commentId}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      onPostUpdate(response.data);
      setEditingComment(null);
      setEditText('');
    } catch (err: any) {
      setError('Failed to edit comment');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      onPostDelete(post._id);
    } catch (err: any) {
      setError('Failed to delete post');
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareUrl = `${window.location.origin}/post/${post._id}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Post link copied to clipboard!');
    } catch (err) {
      setError('Failed to copy share link');
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl shadow-lg p-6 border transition-colors ${
        isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/80 border-white/20'
      } backdrop-blur-md`}
    >
      {/* Post Header */}
      <div className="flex items-center space-x-4 mb-4">
        <Link to={`/profile/${post.author._id}`} className="hover:scale-105 transition-transform">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
          }`}>
            {post.author.profilePicture ? (
              <img
                src={post.author.profilePicture}
                alt={`${post.author.name}'s profile picture`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-semibold">
                {post.author.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </Link>
        <div>
          <Link
            to={`/profile/${post.author._id}`}
            className={`font-semibold hover:underline ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}
            aria-label={`View ${post.author.name}'s profile`}
          >
            {post.author.name}
          </Link>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
        {isOwnPost && (
          <button
            onClick={handleDelete}
            className={`ml-auto p-2 rounded-lg transition-colors hover:scale-105 ${
              isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'
            }`}
            aria-label="Delete post"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Post Content */}
      <p className={`mb-4 text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {post.content}
      </p>

      {/* Post Image */}
      {post.image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <img
            src={post.image}
            alt="Post content"
            className="w-full max-w-md rounded-lg object-cover shadow-md"
          />
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 ${
            isDarkMode ? 'bg-red-900/30 border-red-800 text-red-200' : ''
          }`}
          role="alert"
        >
          {error}
        </motion.div>
      )}

      {/* Post Actions */}
      <div className="flex items-center space-x-6 mb-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 transition-colors hover:scale-105 ${
            isLiked
              ? isDarkMode
                ? 'text-red-400 hover:text-red-300'
                : 'text-red-600 hover:text-red-700'
              : isDarkMode
                ? 'text-gray-400 hover:text-red-400'
                : 'text-gray-600 hover:text-red-600'
          }`}
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{post.likes.length}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center space-x-2 transition-colors hover:scale-105 ${
            isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
          }`}
          aria-label={showComments ? 'Hide comments' : 'Show comments'}
        >
          <MessageCircle className="h-5 w-5" />
          <span>{post.comments.length}</span>
        </button>
        <button
          onClick={handleShare}
          disabled={isSharing}
          className={`flex items-center space-x-2 transition-colors hover:scale-105 ${
            isDarkMode
              ? 'text-gray-400 hover:text-blue-400 disabled:opacity-50'
              : 'text-gray-600 hover:text-blue-600 disabled:opacity-50'
          }`}
          aria-label="Share post"
        >
          <Share2 className={`h-5 w-5 ${isSharing ? 'animate-pulse' : ''}`} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <form onSubmit={handleComment} className="flex items-center space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className={`flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm transition-colors placeholder-gray-500 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                aria-label="Write a comment"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className={`p-2 rounded-lg transition-colors hover:scale-105 ${
                  isDarkMode
                    ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-400'
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-500'
                }`}
                aria-label="Post comment"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            <div className="space-y-3">
              {post.comments.map((commentItem) => (
                <div
                  key={commentItem._id}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'
                  }`}
                >
                  <Link to={`/profile/${commentItem.user._id}`} className="hover:scale-105 transition-transform">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}>
                      {commentItem.user.profilePicture ? (
                        <img
                          src={commentItem.user.profilePicture}
                          alt={`${commentItem.user.name}'s profile picture`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-semibold">
                          {commentItem.user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/profile/${commentItem.user._id}`}
                        className={`font-semibold hover:underline ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {commentItem.user.name}
                      </Link>
                      {commentItem.user._id === user?.id && (
                        <button
                          onClick={() => {
                            setEditingComment(commentItem._id);
                            setEditText(commentItem.text);
                          }}
                          className={`text-sm transition-colors hover:scale-105 ${
                            isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                          }`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {editingComment === commentItem._id ? (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleEditComment(commentItem._id);
                        }} 
                        className="flex items-center space-x-2 mt-2"
                      >
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className={`flex-1 px-3 py-1 rounded-lg border focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm transition-colors placeholder-gray-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={!editText.trim()}
                          className={`p-1 rounded-lg transition-colors hover:scale-105 ${
                            isDarkMode
                              ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-400'
                              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-500'
                          }`}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingComment(null)}
                          className={`p-1 rounded-lg transition-colors hover:scale-105 ${
                            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {commentItem.text}
                      </p>
                    )}
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(commentItem.createdAt).toLocaleString()}
                      {commentItem.updatedAt && ' (edited)'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
