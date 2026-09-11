const Team = require('../models/Team');

// @desc    Submit payment proof (screenshot and transaction ID)
// @route   POST /api/payments/submit-proof
exports.submitProof = async (req, res) => {
  try {
    // 1. Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No proof file uploaded' });
    }

    // 2. Find the user's team
    const team = await Team.findById(req.user.teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // 3. Check if they are the leader
    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Only the team leader can submit proof' });
    }

    // 4. Update the team with the proof details
    team.transactionId = req.body.transactionId;
    team.paymentProof = req.file.path; // Save the file path (e.g., 'uploads/proof-12345.png')
    
    await team.save();

    res.json({ message: 'Proof submitted. Awaiting admin verification.' });

  } catch (error)
 {
    console.error('submitProof error', error);
    res.status(500).json({ message: 'Server error' });
  }
};