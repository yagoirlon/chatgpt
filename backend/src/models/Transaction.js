const mongoose = require('mongoose');

const txSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['steps', 'missions', 'referrals', 'ads', 'withdrawals', 'manual', 'task', 'mission', 'reward', 'referral', 'withdrawal'], required: true },
    flow: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    balanceAfter: { type: Number, required: true },
    meta: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', txSchema);
