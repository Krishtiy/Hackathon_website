const State = require('../models/State');

// @desc    Get the current hackathon state
// @route   GET /api/state
const getHackathonState = async (req, res) => {
  try {
    const state = await State.get();
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Update Round 1 status (Start/End)
// @route   POST /api/state/round1
const updateRound1State = async (req, res) => {
  try {
    const { status, deadline } = req.body;
    const state = await State.get();
    
    if (status) state.round1Status = status;
    
    if (deadline) {
      state.round1Deadline = deadline;
    } else if (status === 'Active') {
      const oneWeek = new Date();
      oneWeek.setDate(oneWeek.getDate() + 7);
      state.round1Deadline = oneWeek;
    }
    await state.save();
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Update Round 2 status (Start/End)
// @route   POST /api/state/round2
const updateRound2State = async (req, res) => {
  try {
    const { status, deadline } = req.body;
    const state = await State.get();
    
    if (status) state.round2Status = status;

    if (deadline) {
      state.round2Deadline = deadline;
    } else if (status === 'Active') {
      const twoWeeks = new Date();
      twoWeeks.setDate(twoWeeks.getDate() + 14);
      state.round2Deadline = twoWeeks;
    }
    await state.save();
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Upload a certificate template
// @route   POST /api/state/certificate/:round
const uploadCertificate = async (req, res) => {
  try {
    const { round } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const state = await State.get();
    
    if (round === '1') {
      state.round1CertificatePath = req.file.path;
    } else if (round === '2') {
      state.round2CertificatePath = req.file.path;
    } else {
      return res.status(400).json({ message: 'Invalid round specified' });
    }
    
    await state.save();
    res.json({ message: 'Certificate uploaded successfully', state });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  getHackathonState, 
  updateRound1State, 
  updateRound2State,
  uploadCertificate
};