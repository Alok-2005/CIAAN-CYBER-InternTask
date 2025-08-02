import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, 
  MessageCircle, 
  Trash2, 
  Send,
  MoreHorizontal 
} from 'lucide-react';

interface PostCardProps {
  post: any;
  onPostUpdate: (post: any) => void;
  onPostDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isLiked = post.likes.some((like: any) => like._id === user?.id || like === user?.id);
  const isAuthor = post.author._id === user?.id;

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/like`);
      onPostUpdate(response.data.post);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/comment`, {
        text: commentText.trim()
      });
      onPostUpdate(response.data);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
      onPostDelete(post._id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${post.author._id}`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center hover:scale-105 transition-transform">
                <span className="text-white font-semibold text-lg">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </Link>
            <div>
              <Link 
                to={`/profile/${post.author._id}`}
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {post.author.name}
              </Link>
              <p className="text-gray-500 text-sm">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          
          {isAuthor && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Post</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isLiked
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{post.likes.length}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">{post.comments.length}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {/* Add Comment */}
          <form onSubmit={handleComment} className="mt-4 mb-6">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={loading || !commentText.trim()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors transform hover:scale-105"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.map((comment: any) => (
              <div key={comment._id} className="flex space-x-3">
                <Link to={`/profile/${comment.user._id}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center hover:scale-105 transition-transform">
                    <span className="text-white text-sm font-semibold">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </Link>
                <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <Link 
                      to={`/profile/${comment.user._id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm"
                    >
                      {comment.user.name}
                    </Link>
                    <span className="text-gray-500 text-xs">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;