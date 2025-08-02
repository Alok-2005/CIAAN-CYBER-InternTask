import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all posts (feed)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments();

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, image } = req.body;

    const post = await Post.create({
      content,
      image: image || '',
      author: req.user._id
    });

    // Update user's posts count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { postsCount: 1 }
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.user', 'name profilePicture');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/Unlike post
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
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      text
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.user', 'name profilePicture');

    res.json(updatedPost);
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
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);

    // Update user's posts count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { postsCount: -1 }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;