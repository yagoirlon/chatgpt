const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema(
  {
    inviterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    invitedId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reward: { type: Number, default: 10 },
    status: { type: String, enum: ['pending', 'completed'], default: 'completed' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Referral', referralSchema);
