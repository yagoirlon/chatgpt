import { Pedometer } from 'expo-sensors';
import * as Device from 'expo-device';
import api from './api';

let interval;

export const startStepSync = async (onUpdate) => {
  const perm = await Pedometer.requestPermissionsAsync();
  if (!perm.granted) return;

  const sub = Pedometer.watchStepCount((result) => onUpdate?.(result.steps));

  interval = setInterval(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const data = await Pedometer.getStepCountAsync(today, new Date());
    await api.post('/steps/sync', {
      stepsToday: data.steps,
      deviceFingerprint: `${Device.brand}-${Device.modelName}-${Device.osBuildId}`,
      isEmulator: !Device.isDevice
    });
  }, 300000);

  return () => {
    sub.remove();
    clearInterval(interval);
  };
};
