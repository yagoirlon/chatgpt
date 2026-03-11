const Step = require('../models/Step');
const User = require('../models/User');
const { validateStepSync } = require('../services/antiFraudService');
const { creditWallet } = require('../services/walletService');

exports.sync = async (req, res) => {
  const { stepsToday, deviceFingerprint, isEmulator } = req.body;
  const date = new Date().toISOString().split('T')[0];
  let stepDoc = await Step.findOne({ user: req.user._id, date });
  if (!stepDoc) stepDoc = await Step.create({ user: req.user._id, date, steps: 0, rewardedCoins: 0, anomalies: [] });

  const check = validateStepSync({
    incomingSteps: stepsToday,
    previousSteps: stepDoc.steps,
    deviceFingerprint,
    knownFingerprints: req.user.deviceFingerprints,
    isEmulator
  });

  if (!req.user.deviceFingerprints.includes(deviceFingerprint) && deviceFingerprint) {
    req.user.deviceFingerprints.push(deviceFingerprint);
  }

  const previous = stepDoc.steps;
  stepDoc.steps = check.acceptedSteps;
  stepDoc.anomalies = [...new Set([...stepDoc.anomalies, ...check.anomalies])];

  const eligibleCoins = Math.floor(check.acceptedSteps / 1000);
  const toCredit = Math.max(0, eligibleCoins - stepDoc.rewardedCoins);
  if (toCredit > 0 && check.anomalies.length === 0) {
    stepDoc.rewardedCoins += toCredit;
    await creditWallet({ userId: req.user._id, amount: toCredit, type: 'step', meta: { date } });
    req.user.coins += toCredit;
  }

  req.user.stepsToday = check.acceptedSteps;
  req.user.totalSteps += Math.max(0, check.acceptedSteps - previous);
  req.user.lastKnownIp = req.ip;

  await Promise.all([stepDoc.save(), req.user.save()]);

  res.json({ steps: stepDoc.steps, anomalies: stepDoc.anomalies, coinsEarned: toCredit });
};
