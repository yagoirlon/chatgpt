const Step = require('../models/Step');
const Referral = require('../models/Referral');
const User = require('../models/User');
const { validateStepSync } = require('../services/antiFraudService');
const { creditWallet } = require('../services/walletService');
const { getConfig, calculateStepCoins, streakBonusFor } = require('../services/rewardRulesService');

exports.sync = async (req, res) => {
  const { stepsToday, deviceFingerprint, isEmulator, fakeStepAppDetected, stepsInLastHour = 0 } = req.body;
  const date = new Date().toISOString().split('T')[0];
  const cfg = await getConfig();

  let stepDoc = await Step.findOne({ userId: req.user._id, date });
  if (!stepDoc) stepDoc = await Step.create({ userId: req.user._id, date, stepCount: 0, coinsEarned: 0, anomalies: [] });

  const check = validateStepSync({
    incomingSteps: stepsToday,
    previousSteps: stepDoc.stepCount,
    deviceFingerprint,
    knownFingerprints: req.user.deviceFingerprints || [],
    isEmulator
  });

  if (stepsInLastHour > cfg.maxStepsPerHour) check.anomalies.push('hourly_step_limit_exceeded');
  if (fakeStepAppDetected) check.anomalies.push('fake_step_app_detected');

  if (!req.user.deviceFingerprints.includes(deviceFingerprint) && deviceFingerprint) req.user.deviceFingerprints.push(deviceFingerprint);

  const previous = stepDoc.stepCount;
  stepDoc.stepCount = Math.min(check.acceptedSteps, cfg.maxDailyStepsCounted);
  stepDoc.anomalies = [...new Set([...stepDoc.anomalies, ...check.anomalies])];

  const toCredit = calculateStepCoins({ stepCount: stepDoc.stepCount, alreadyRewarded: stepDoc.coinsEarned, cfg });
  if (toCredit > 0 && check.anomalies.length === 0) {
    stepDoc.coinsEarned += toCredit;
    await creditWallet({ userId: req.user._id, amount: toCredit, type: 'step', steps: stepDoc.stepCount, meta: { date } });
    req.user.coins += toCredit;
    req.user.coinsEarnedToday += toCredit;
  }

  if (stepDoc.stepCount > 0) {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().split('T')[0];
    if (req.user.lastActiveDate !== date) {
      req.user.streakCount = req.user.lastActiveDate === yesterday ? req.user.streakCount + 1 : 1;
      req.user.lastActiveDate = date;
      const streakBonus = streakBonusFor(req.user.streakCount);
      if (streakBonus > 0) {
        await creditWallet({ userId: req.user._id, amount: streakBonus, type: 'mission', meta: { reason: 'streak', streak: req.user.streakCount } });
        req.user.coins += streakBonus;
        req.user.coinsEarnedToday += streakBonus;
      }
    }
  }

  if (stepDoc.stepCount >= cfg.referralTargetSteps) {
    const pendingRefs = await Referral.find({ invitedId: req.user._id, status: 'pending' });
    for (const ref of pendingRefs) {
      const inviter = await User.findById(ref.inviterId);
      const blocked = !inviter || inviter.deviceId === req.user.deviceId || inviter.lastKnownIp === req.user.lastKnownIp;
      if (!blocked) {
        await creditWallet({ userId: ref.inviterId, amount: cfg.referralRewardOnTarget, type: 'referral', meta: { invitedId: req.user._id, milestone: cfg.referralTargetSteps } });
        inviter.coins += cfg.referralRewardOnTarget;
        await inviter.save();
        ref.status = 'completed';
        await ref.save();
      }
    }
  }

  if (check.anomalies.length) req.user.isSuspicious = true;
  req.user.stepsToday = stepDoc.stepCount;
  req.user.totalSteps += Math.max(0, stepDoc.stepCount - previous);
  req.user.lastKnownIp = req.ip;

  await Promise.all([stepDoc.save(), req.user.save()]);

  res.json({ steps: stepDoc.stepCount, anomalies: stepDoc.anomalies, coinsEarned: toCredit, coinsEarnedToday: req.user.coinsEarnedToday, streak: req.user.streakCount });
};

exports.today = async (req, res) => {
  const date = new Date().toISOString().split('T')[0];
  const stepDoc = await Step.findOne({ userId: req.user._id, date });
  res.json({ date, stepCount: stepDoc?.stepCount || 0, coinsEarned: stepDoc?.coinsEarned || 0, streak: req.user.streakCount, coinsEarnedToday: req.user.coinsEarnedToday || 0 });
};
