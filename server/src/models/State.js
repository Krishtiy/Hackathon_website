const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  key: { 
    type: String, 
    default: 'global', 
    unique: true 
  },
  round1Status: {
    type: String,
    enum: ['Pending', 'Active', 'Completed'],
    default: 'Pending'
  },
  round1Deadline: {
    type: Date,
    default: null
  },
  round2Status: {
    type: String,
    enum: ['Pending', 'Active', 'Completed'],
    default: 'Pending'
  },
  round2Deadline: {
    type: Date,
    default: null
  },
  round1CertificatePath: { type: String, default: null },
  round2CertificatePath: { type: String, default: null }
});

// This function creates the 'global' state document the first time it's needed
stateSchema.statics.get = async function() {
  let state = await this.findOne({ key: 'global' });
  if (!state) {
    state = await this.create({ key: 'global' });
  }
  return state;
};

const State = mongoose.model('State', stateSchema);
module.exports = State;