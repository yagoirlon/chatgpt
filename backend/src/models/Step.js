const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    steps: { type: Number, default: 0 },
    rewardedCoins: { type: Number, default: 0 },
    anomalies: [{ type: String }]
  },
  { timestamps: true }
);

stepSchema.index({ user: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Step', stepSchema);
