const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  title: {
    type: String,
    required: true
  },
  
  // --- Fields for Round 1 (MCQ) ---
  options: [{
    type: String
  }],
  correctOption: {
    type: Number
  },

  // --- Fields for Round 2 (Project) ---
  // These are no longer 'required'
  description: {
    type: String
  },
  points: {
    type: Number
  },
  deadline: {
    type: Date
  }
}, {
  timestamps: true
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;