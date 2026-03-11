const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coins: Number,
    amountBRL: Number,
    pixKey: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
    pixTxId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
