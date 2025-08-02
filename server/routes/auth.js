import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      bio: bio || '',
      profilePicture: '',
      followers: [],
      following: [],
      postsCount: 0,
    });

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        postsCount: user.postsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        postsCount: user.postsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('followers', 'name email profilePicture')
      .populate('following', 'name email profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      followers: user.followers.map(f => ({
        id: f._id.toString(),
        name: f.name,
        email: f.email,
        profilePicture: f.profilePicture,
      })),
      following: user.following.map(f => ({
        id: f._id.toString(),
        name: f.name,
        email: f.email,
        profilePicture: f.profilePicture,
      })),
      postsCount: user.postsCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;