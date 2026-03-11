const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coins: Number,
    method: { type: String, enum: ['PIX', 'PAYPAL'] },
    destination: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    pixTxId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
