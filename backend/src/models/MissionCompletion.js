const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    date: { type: String, required: true },
    completedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);
schema.index({ user: 1, mission: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MissionCompletion', schema);
