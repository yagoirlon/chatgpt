const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    status: { type: String, enum: ['pending', 'verified'], default: 'verified' }
  },
  { timestamps: true }
);
schema.index({ user: 1, task: 1 }, { unique: true });

module.exports = mongoose.model('TaskCompletion', schema);
