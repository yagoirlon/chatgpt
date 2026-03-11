const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    steps: { type: Number, default: 0 },
    coinsEarned: { type: Number, required: true },
    source: { type: String, enum: ['step', 'mission', 'task', 'referral', 'manual'], required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    referenceId: mongoose.Schema.Types.ObjectId,
    meta: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reward', rewardSchema);
