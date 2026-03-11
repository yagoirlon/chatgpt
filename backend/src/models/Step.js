const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    stepCount: { type: Number, default: 0 },
    coinsEarned: { type: Number, default: 0 },
    anomalies: [{ type: String }]
  },
  { timestamps: true }
);

stepSchema.index({ userId: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Step', stepSchema);
