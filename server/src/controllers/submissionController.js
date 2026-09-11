const Submission = require('../models/Submission');
const Team = require('../models/Team');

// --- Your Original Functions ---

// Submit an answer (likely for R1 quiz - though quizController handles this now)
const submitAnswer = async (req, res) => {
  try {
    const { questionId, answer, files } = req.body;
    const teamId = req.user.teamId;
    if (!teamId) return res.status(400).json({ message: 'User not in a team' });

    const submission = await Submission.create({ team: teamId, question: questionId, answer, files });
    res.status(201).json(submission);
  } catch (error) {
    console.error('submitAnswer error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List submissions for a team
const listSubmissionsForTeam = async (req, res) => {
  try {
    const teamId = req.user.teamId;
    if (!teamId) return res.status(400).json({ message: 'User not in a team' });

    const subs = await Submission.find({ team: teamId }).populate('question');
    res.json(subs);
  } catch (error) {
    console.error('listSubmissionsForTeam error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Admin Functions We Added ---

// @desc    Admin: Get all submissions for a specific question
// @route   GET /api/submissions/question/:questionId
const getSubmissionsForQuestion = async (req, res) => {
  try {
    const submissions = await Submission.find({ question: req.params.questionId })
      .populate('team', 'name')
      .populate('question', 'title');

    res.json(submissions);
  } catch (error) {
    console.error('getSubmissionsForQuestion error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Grade a submission (for R1 quiz)
// @route   PUT /api/submissions/:id/grade
const gradeSubmission = async (req, res) => {
  try {
    const { score } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.score = score;
    submission.status = 'evaluated'; // Assuming 'status' is in your model
    
    const updatedSubmission = await submission.save();
    res.json(updatedSubmission);

  } catch (error) {
    console.error('gradeSubmission error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- New Round 2 Functions ---

// @desc    Team Leader: Submit for Round 2
// @route   POST /api/submissions/round2
const submitRound2 = async (req, res) => {
  try {
    const user = req.user;
    const { submissionNotes } = req.body;

    // 1. Check for file (from uploadMiddleware)
    if (!req.file) {
      return res.status(400).json({ message: 'No .zip file uploaded' });
    }

    // 2. Find team
    const team = await Team.findById(user.teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // 3. Check if leader
    if (team.leader.toString() !== user._id.toString()) {
      return res.status(401).json({ message: 'Only the team leader can make a submission' });
    }

    // 4. Check if already submitted (based on new model index)
    const existingSubmission = await Submission.findOne({ team: team._id, round: 2 });
    if (existingSubmission) {
      return res.status(400).json({ message: 'Your team has already submitted for Round 2' });
    }

    // 5. Create new submission
    const submission = await Submission.create({
      user: user._id,
      team: team._id,
      round: 2,
      projectZipFile: req.file.path, // Save the file path
      submissionNotes: submissionNotes
    });
    
    // 6. Update team status
    team.round2Status = 'completed'; // 'completed' means "submitted"
    await team.save();

    res.status(201).json({ message: 'Round 2 submission successful!', submission });

  } catch (error) {
    console.error('submitRound2 error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Participant: Get team's Round 2 submission
// @route   GET /api/submissions/myteam/2
const getMyRound2Submission = async (req, res) => {
  try {
    const submission = await Submission.findOne({ team: req.user.teamId, round: 2 });
    if (!submission) {
      return res.status(404).json({ message: 'No submission found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRound2Submissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ round: 2 })
      .populate('team', 'name isFinalist')
      .populate('user', 'name email'); // The user who submitted

    res.json(submissions);
  } catch (error) {
    console.error('getRound2Submissions error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- UPDATE YOUR EXPORTS ---
module.exports = {
  submitAnswer, 
  listSubmissionsForTeam,
  getSubmissionsForQuestion,
  gradeSubmission,
  submitRound2,
  getMyRound2Submission,
  getRound2Submissions
};