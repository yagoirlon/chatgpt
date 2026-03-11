const mongoose = require('mongoose');

const walletEntrySchema = new mongoose.Schema({
  type: { type: String, enum: ['step', 'mission', 'task', 'referral', 'withdrawal'] },
  amount: Number,
  meta: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

const walletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    balance: { type: Number, default: 0 },
    history: [walletEntrySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);
