const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    source: { type: String, enum: ['admob', 'offerwall', 'partner-link'] },
    amountUSD: Number,
    meta: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Revenue', schema);
