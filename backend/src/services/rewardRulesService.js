const RewardConfig = require('../models/RewardConfig');

exports.COIN_TO_BRL = 0.01;

exports.getConfig = async () => {
  let cfg = await RewardConfig.findOne();
  if (!cfg) cfg = await RewardConfig.create({});
  return cfg;
};

exports.calculateStepCoins = ({ stepCount, alreadyRewarded, cfg }) => {
  const countedSteps = Math.min(stepCount, cfg.maxDailyStepsCounted);
  const eligibleCoins = Math.floor(countedSteps / cfg.stepToCoinSteps);
  const cappedEligible = Math.min(eligibleCoins, cfg.maxDailyCoinsFromSteps);
  return Math.max(0, cappedEligible - alreadyRewarded);
};

exports.streakBonusFor = (streak) => {
  if (streak > 0 && streak % 30 === 0) return 80;
  if (streak > 0 && streak % 7 === 0) return 15;
  if (streak > 0 && streak % 3 === 0) return 5;
  return 0;
};

exports.coinsToBRL = (coins) => Number((coins * exports.COIN_TO_BRL).toFixed(2));
