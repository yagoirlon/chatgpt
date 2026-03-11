const MAX_DAILY_STEPS = 30000;
const MAX_SPIKE_PER_SYNC = 4000;

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
