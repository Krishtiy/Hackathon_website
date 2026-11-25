const mongoose = require('mongoose');
const Team = require('../models/Team');
const User = require('../models/User');

// Create a team
const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const teamExists = await Team.findOne({ name });
    if (teamExists) return res.status(400).json({ message: 'Team name already taken' });

    const team = await Team.create({ name, leader: req.user._id, members: [req.user._id] });
    
    const user = await User.findById(req.user._id);
    user.teamId = team._id;
    await user.save();
    
    res.status(201).json(team);
  } catch (error) {
    console.error('createTeam error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get team details
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('leader', 'name email').populate('members', 'name email');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    console.error('getTeamById error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add member to team by email (only leader, race-condition protected with atomic check)
const addMember = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { email } = req.body;
    const teamId = req.params.id;

    const newMember = await User.findOne({ email }).session(session);
    if (!newMember) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'User not found' });
    }
    if (newMember.teamId) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'User already in a team' });
    }

    // ATOMIC ENGINE-LEVEL CAPACITY CHECK:
    // Only succeeds if leader matches AND member array size is strictly < 3
    const updatedTeam = await Team.findOneAndUpdate(
      {
        _id: teamId,
        leader: req.user._id,
        $expr: { $lt: [{ $size: '$members' }, 3] }
      },
      { $push: { members: newMember._id } },
      { new: true, session }
    );

    if (!updatedTeam) {
      await session.abortTransaction();
      return res.status(400).json({
        message: 'Team is already full (max 3 members) or unauthorized action'
      });
    }

    newMember.teamId = updatedTeam._id;
    await newMember.save({ session });

    await session.commitTransaction();

    const populatedTeam = await Team.findById(updatedTeam._id).populate('members', 'name email');
    res.json(populatedTeam);
  } catch (error) {
    await session.abortTransaction();
    console.error('addMember error', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    session.endSession();
  }
};

// Get details for the user's current team
const getMyTeam = async (req, res) => {
  try {
    if (!req.user.teamId) {
      return res.status(404).json({ message: 'You are not in a team' });
    }
    
    const team = await Team.findById(req.user.teamId)
      .populate('leader', 'name email')
      .populate('members', 'name email college');

    if (!team) {
      req.user.teamId = null;
      await req.user.save();
      return res.status(404).json({ message: 'Team not found. Your team link has been reset.' });
    }
    
    res.json(team);
  } catch (error) {
    console.error('getMyTeam error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Get all teams
// @route   GET /api/teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({})
      .populate('leader', 'name email')
      .populate('members', 'name email');
      
    res.json(teams);
  } catch (error) {
    console.error('getAllTeams error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Manually verify a team's payment
// @route   POST /api/teams/:id/verify-payment
const verifyTeamPayment = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.paymentStatus = 'completed';
    await team.save();
    
    res.json({ message: 'Payment verified', team });
  } catch (error) {
    console.error('verifyTeamPayment error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Delete a team AND all its members
// @route   DELETE /api/teams/:id
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(4404).json({ message: 'Team not found' });
    }

    // 1. Find and DELETE all users who are members of this team
    await User.deleteMany(
      { _id: { $in: team.members } } // This uses deleteMany as requested
    );

    // 2. Delete the team itself
    await team.deleteOne();

    res.json({ message: 'Team and all its members have been removed' });
  } catch (error) {
    console.error('deleteTeam error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Get ranked results for Round 1
// @route   GET /api/teams/results/1
const getRound1Results = async (req, res) => {
  try {
    // 1. Find all teams that have completed payment
    const teams = await Team.find({ paymentStatus: 'completed' })
      .select('name round1FinalScore round1AvgSubmissionTime members')
      .populate('leader', 'name')
      .sort({ round1FinalScore: -1, round1AvgSubmissionTime: 1 }); // 2. Sort by score (high to low), then time (low to high)

    res.json(teams);
  } catch (error)
 {
    console.error('getRound1Results error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const advanceTeamToFinale = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Set the team as a finalist
    team.isFinalist = true;
    await team.save();
    
    res.json({ message: 'Team advanced to finale', team });
  } catch (error) {
    console.error('advanceTeamToFinale error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// This export object is now correct
module.exports = {
  createTeam,
  getTeamById,
  addMember,
  getMyTeam,
  getAllTeams,
  verifyTeamPayment,
  deleteTeam,
  getRound1Results,
  advanceTeamToFinale
};