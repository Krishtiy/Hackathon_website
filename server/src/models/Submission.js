const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  round: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  
  // --- Round 1 (Quiz) Fields ---
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: { type: Number }
  }],
  score: {
    type: Number,
    default: 0
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  
  // --- Round 2 (Project) Fields ---
  projectZipFile: {
    type: String,
  },
  submissionNotes: {
    type: String,
  },
  
}, {
  timestamps: true
});

// THIS IS THE CORRECT RULE:
// A user can only submit one attempt for Round 1
submissionSchema.index({ user: 1, round: 1 }, { unique: true }); 

// THIS IS THE CORRECT, FIXED RULE FOR ROUND 2:
// A team can only submit one project for Round 2
submissionSchema.index(
  { team: 1, round: 2 }, 
  { 
    unique: true, 
    partialFilterExpression: { round: 2 } // Only applies to R2
  }
); 

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;