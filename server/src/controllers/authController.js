const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Team = require('../models/Team');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, name, college, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password, name, college, phone });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('register error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('login error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get profile of logged-in user
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('getProfile error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Get all users
// @route   GET /api/auth/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }) 
      .populate('teamId', 'name')
      .select('-password');
      
    res.json(users);
  } catch (error) {
    console.error('getAllUsers error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Delete a user
// @route   DELETE /api/auth/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is in a team, remove them from it
    if (user.teamId) {
      const team = await Team.findById(user.teamId);
      if (team) {
        team.members.pull(user._id);
        
        if (team.leader.toString() === user._id.toString()) {
          // Leader is being deleted
        }
        await team.save();
      }
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });

  } catch (error) {
    console.error('deleteUser error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// This export object must contain ALL functions
module.exports = {
  register,
  login,
  getProfile,
  generateToken,
  getAllUsers,
  deleteUser 
};