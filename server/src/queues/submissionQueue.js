const { Queue, Worker } = require('bullmq');
const redis = require('../config/redis');
const Submission = require('../models/Submission');
const Team = require('../models/Team');
const Question = require('../models/Question');
const LeaderboardService = require('../services/leaderboardService');
const EventEmitter = require('events');

const submissionEvents = new EventEmitter();

// Initialize BullMQ queue with Redis connection
const submissionQueue = new Queue('quiz-submissions', { connection: redis });

// Background Worker
const worker = new Worker('quiz-submissions', async (job) => {
  const { submissionId, answers, teamId } = job.data;

  job.updateProgress(20);
  submissionEvents.emit(`status:${submissionId}`, { status: 'RUNNING', progress: 20 });

  const questions = await Question.find({ round: 1 }).select('correctOption');
  const answerMap = new Map(questions.map(q => [q._id.toString(), q.correctOption]));

  let score = 0;
  if (Array.isArray(answers)) {
    answers.forEach(ans => {
      if (answerMap.get(ans.questionId) === ans.selectedOption) score++;
    });
  }

  job.updateProgress(65);
  submissionEvents.emit(`status:${submissionId}`, { status: 'RUNNING', progress: 65 });

  const submission = await Submission.findByIdAndUpdate(
    submissionId,
    { score, answers, endTime: new Date() },
    { new: true }
  );

  if (submission && teamId) {
    const teamSubs = await Submission.find({ team: teamId, round: 1 });
    const avgScore = teamSubs.length > 0
      ? teamSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / teamSubs.length
      : score;
    const timeTaken = (submission.endTime - submission.startTime) / 1000;

    await Team.findByIdAndUpdate(teamId, { round1FinalScore: avgScore });
    await LeaderboardService.updateScore(teamId, avgScore, timeTaken);

    job.updateProgress(100);
    submissionEvents.emit(`status:${submissionId}`, { status: 'COMPLETED', score, avgScore });
    return { score, avgScore };
  }

  submissionEvents.emit(`status:${submissionId}`, { status: 'COMPLETED', score });
  return { score };
}, { connection: redis });

worker.on('error', (err) => console.error('Submission Worker Warning:', err.message));

module.exports = { submissionQueue, submissionEvents };
