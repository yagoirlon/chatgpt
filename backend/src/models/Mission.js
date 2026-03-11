const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema(
  {
    title: String,
    stepsRequired: { type: Number, default: 0 },
    rewardCoins: { type: Number, default: 0 },
    type: { type: String, enum: ['steps', 'invite', 'daily_open'], default: 'steps' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mission', missionSchema);
