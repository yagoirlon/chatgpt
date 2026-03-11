const User = require('../models/User');

const MAX_DAILY_STEPS = 12000;
const MAX_SPIKE_PER_SYNC = 3500;

exports.validateStepSync = ({ incomingSteps, previousSteps, deviceFingerprint, knownFingerprints, isEmulator }) => {
  const anomalies = [];
  if (isEmulator) anomalies.push('emulator_detected');
  if (!deviceFingerprint) anomalies.push('missing_fingerprint');
  if (knownFingerprints.length > 0 && !knownFingerprints.includes(deviceFingerprint)) anomalies.push('new_device_fingerprint');

  const delta = Math.max(0, incomingSteps - previousSteps);
  if (delta > MAX_SPIKE_PER_SYNC) anomalies.push('step_spike_detected');
  if (incomingSteps > MAX_DAILY_STEPS) anomalies.push('daily_limit_exceeded');

  const acceptedSteps = Math.min(incomingSteps, MAX_DAILY_STEPS);
  return { anomalies, acceptedSteps, delta };
};

exports.validateRegistrationRisk = async ({ deviceId, ip }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (deviceId) {
    const existingDevice = await User.findOne({ deviceId });
    if (existingDevice) return { blocked: true, reason: 'device_already_registered' };
  }

  const ipCount = await User.countDocuments({ lastKnownIp: ip, createdAt: { $gte: today } });
  if (ipCount >= 3) return { blocked: true, reason: 'ip_daily_limit_exceeded' };

  return { blocked: false };
};
