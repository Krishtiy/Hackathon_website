const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Team = require('../models/Team'); 

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized - No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized - User not found' });
    }

    next();
  } catch (error) {
    console.error(error); 
    res.status(401).json({ message: 'Not authorized - Invalid token' });
  }
};


const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

const isTeamMember = async (req, res, next) => {
    try {
      const team = await Team.findOne({
        $or: [{ leader: req.user._id }, { members: req.user._id }]
      });

      if (team) {
        req.team = team; 
        next();
      } else {
        res.status(403).json({ message: 'You are not part of any team.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error checking team status.' });
    }
};

module.exports = { protect, admin, isTeamMember };