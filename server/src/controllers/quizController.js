const State = require('../models/State');
const Team = require('../models/Team');
const Question = require('../models/Question');
const Submission = require('../models/Submission');

// @desc    Participant: Start the quiz
// @route   GET /api/quiz/start/1
exports.startQuiz = async (req, res) => {
  try {
    const user = req.user;
    const team = await Team.findById(user.teamId);
    const state = await State.get();

    // 1. Check Hackathon state
    if (state.round1Status !== 'Active') {
      return res.status(400).json({ message: 'Round 1 is not currently active.' });
    }

    // 2. Check team payment
    if (team.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Your team\'s payment is not verified.' });
    }
    
    // 3. Check if THIS USER already submitted
    const existingSubmission = await Submission.findOne({ user: user._id, round: 1 });
    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted the quiz.' });
    }
    
    // 4. Create new submission record
    const startTime = new Date();
    const submission = await Submission.create({
      user: user._id,
      team: user.teamId,
      round: 1,
      startTime: startTime
    });

    // 5. Fetch and send questions (without answers)
    const questions = await Question.find({ round: 1 }).select('-correctOption');

    res.json({
      submissionId: submission._id,
      startTime: startTime,
      questions: questions,
      deadline: new Date(startTime.getTime() + 30 * 60000) // 30 minutes
    });

  } catch (error) {
    // This will catch any other crash
    console.error('startQuiz Error:', error); // Log the real error to the terminal
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Participant: Submit the quiz
// @route   POST /api/quiz/submit/1
exports.submitQuiz = async (req, res) => {
  try {
    const { submissionId, answers } = req.body;
    
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }
    if (submission.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    const endTime = new Date();
    const timeLimit = new Date(submission.startTime.getTime() + 30.5 * 60000);
    if (endTime > timeLimit) {
      return res.status(400).json({ message: 'Time limit exceeded. Submission rejected.' });
    }

    const questions = await Question.find({ round: 1 }).select('correctOption');
    const answerMap = {};
    questions.forEach(q => {
      answerMap[q._id.toString()] = q.correctOption;
    });
    
    let score = 0;
    for (const ans of answers) {
      if (answerMap[ans.questionId] === ans.selectedOption) {
        score++;
      }
    }

    const submissionTimeInSeconds = (endTime.getTime() - submission.startTime.getTime()) / 1000;
    submission.endTime = endTime;
    submission.answers = answers;
    submission.score = score;
    await submission.save();
    
    await updateTeamAverage(submission.team);

    res.json({
      message: 'Quiz submitted successfully!',
      score: score,
      totalQuestions: questions.length
    });

  } catch (error) {
    console.error('submitQuiz Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Helper function to update team average ---
const updateTeamAverage = async (teamId) => {
  const submissions = await Submission.find({ team: teamId, round: 1, endTime: { $exists: true } });
  
  if (submissions.length > 0) {
    let totalScore = 0;
    let totalTime = 0;
    
    for (const sub of submissions) {
      totalScore += sub.score;
      totalTime += (sub.endTime.getTime() - sub.startTime.getTime()) / 1000;
    }
    
    const avgScore = totalScore / submissions.length;
    const avgTime = totalTime / submissions.length;

    await Team.findByIdAndUpdate(teamId, {
      round1FinalScore: avgScore,
      round1AvgSubmissionTime: avgTime,
      round1Status: 'completed'
    });
  }
};

// --- Your existing getMySubmission/deleteMySubmission functions ---

exports.getMySubmission = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      user: req.user._id,
      round: 1
    });

    if (!submission) {
      return res.status(404).json({ message: 'You have not taken the quiz yet.' });
    }
    const totalQuestions = await Question.countDocuments({ round: 1 });
    res.json({
      submission,
      totalQuestions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteMySubmission = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      user: req.user._id,
      round: 1
    });

    if (!submission) {
      return res.status(404).json({ message: 'No submission found to delete.' });
    }
    await submission.deleteOne();
    await updateTeamAverage(submission.team);
    res.json({ message: 'Your quiz attempt has been reset.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};