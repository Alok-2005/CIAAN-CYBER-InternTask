import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });  // Create 'uploads/' folder in backend root

// Get all posts (feed)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const posts = await Post.find()
      .populate('author', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Post.countDocuments();

    const formattedPosts = posts.map(post => ({
      _id: post._id.toString(),
      content: post.content,
      image: post.image || '',
      author: {
        _id: post.author._id.toString(),
        name: post.author.name,
        email: post.author.email,
        profilePicture: post.author.profilePicture,
      },
      likes: post.likes.map(user => ({
        _id: user._id.toString(),
        name: user.name,
      })),
      comments: post.comments.map(comment => ({
        _id: comment._id.toString(),
        user: {
          _id: comment.user._id.toString(),
          name: comment.user.name,
          profilePicture: comment.user.profilePicture,
        },
        text: comment.text,
        createdAt: comment.createdAt,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    res.json({
      posts: formattedPosts,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'No body provided' });
    }
    const { content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    if (!content && !image) {
      return res.status(400).json({ message: 'Content or image required' });
    }
    const post = await Post.create({
      content: content || '',
      image: image || '',
      author: req.user._id,
    });
    await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.user', 'name profilePicture');
    res.status(201).json({
      _id: populatedPost._id.toString(),
      content: populatedPost.content,
      image: populatedPost.image || '',
      author: {
        _id: populatedPost.author._id.toString(),
        name: populatedPost.author.name,
        email: populatedPost.author.email,
        profilePicture: populatedPost.author.profilePicture,
      },
      likes: populatedPost.likes.map(user => ({
        _id: user._id.toString(),
        name: user.name,
      })),
      comments: populatedPost.comments.map(comment => ({
        _id: comment._id.toString(),
        user: {
          _id: comment.user._id.toString(),
          name: comment.user.name,
          profilePicture: comment.user.profilePicture,
        },
        text: comment.text,
        createdAt: comment.createdAt,
      })),
      createdAt: populatedPost.createdAt,
      updatedAt: populatedPost.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/Unlike post (toggle in one route)
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.user', 'name profilePicture');

    res.json({
      message: isLiked ? 'Post unliked' : 'Post liked',
      post: {
        _id: updatedPost._id.toString(),
        content: updatedPost.content,
        image: updatedPost.image || '',
        author: {
          _id: updatedPost.author._id.toString(),
          name: updatedPost.author.name,
          email: updatedPost.author.email,
          profilePicture: updatedPost.author.profilePicture,
        },
        likes: updatedPost.likes.map(user => ({
          _id: user._id.toString(),
          name: user.name,
        })),
        comments: updatedPost.comments.map(comment => ({
          _id: comment._id.toString(),
          user: {
            _id: comment.user._id.toString(),
            name: comment.user.name,
            profilePicture: comment.user.profilePicture,
          },
          text: comment.text,
          createdAt: comment.createdAt,
        })),
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date(),
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.user', 'name profilePicture');

    res.json({
      _id: updatedPost._id.toString(),
      content: updatedPost.content,
      image: updatedPost.image || '',
      author: {
        _id: updatedPost.author._id.toString(),
        name: updatedPost.author.name,
        email: updatedPost.author.email,
        profilePicture: updatedPost.author.profilePicture,
      },
      likes: updatedPost.likes.map(user => ({
        _id: user._id.toString(),
        name: user.name,
      })),
      comments: updatedPost.comments.map(comment => ({
        _id: comment._id.toString(),
        user: {
          _id: comment.user._id.toString(),
          name: comment.user.name,
          profilePicture: comment.user.profilePicture,
        },
        text: comment.text,
        createdAt: comment.createdAt,
      })),
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Edit comment
router.put('/:postId/comments/:commentId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    comment.text = text;
    comment.updatedAt = new Date();
    await post.save();
    const updatedPost = await Post.findById(req.params.postId)
      .populate('author', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.user', 'name profilePicture');
    res.json({
      _id: updatedPost._id.toString(),
      content: updatedPost.content,
      image: updatedPost.image || '',
      author: {
        _id: updatedPost.author._id.toString(),
        name: updatedPost.author.name,
        email: updatedPost.author.email,
        profilePicture: updatedPost.author.profilePicture,
      },
      likes: updatedPost.likes.map(user => ({
        _id: user._id.toString(),
        name: user.name,
      })),
      comments: updatedPost.comments.map(comment => ({
        _id: comment._id.toString(),
        user: {
          _id: comment.user._id.toString(),
          name: comment.user.name,
          profilePicture: comment.user.profilePicture,
        },
        text: comment.text,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })),
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    // Update user's posts count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { postsCount: -1 },
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
