const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    stepToCoinSteps: { type: Number, default: 1000 },
    maxDailyStepsCounted: { type: Number, default: 12000 },
    maxDailyCoinsFromSteps: { type: Number, default: 12 },
    maxStepsPerHour: { type: Number, default: 6000 },
    adRewardPerView: { type: Number, default: 2 },
    maxAdsPerDay: { type: Number, default: 3 },
    referralRewardOnTarget: { type: Number, default: 50 },
    referralTargetSteps: { type: Number, default: 3000 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RewardConfig', schema);
