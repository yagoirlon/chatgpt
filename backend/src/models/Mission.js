const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema(
  {
    title: String,
    targetSteps: Number,
    reward: Number,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mission', missionSchema);
