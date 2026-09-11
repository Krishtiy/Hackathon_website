const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  transactionId: { type: String, default: null },
  paymentProof: { type: String, default: null },
  round1TestStartedAt: {
    type: Date,
    default: null
  },
  round1TestFinished: {
    type: Boolean,
    default: false
  },
  round1Score: {
    type: Number,
    default: 0
  },
  round1Submission: {
    type: Map, 
    of: String,
    default: {}
  },
  round1Status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  
  // --- ADD THESE TWO LINES ---
  round1FinalScore: { type: Number, default: 0 },
  round1AvgSubmissionTime: { type: Number, default: 0 }, // in seconds

  round2Status: {
    type: String,
    enum: ['not_started', 'in_progress', 'submitted', 'completed'],
    default: 'not_started'
  },
  
  isFinalist: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;