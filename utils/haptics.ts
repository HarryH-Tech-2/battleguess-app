import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptics helpers that are safe on web and swallow errors on devices without a motor.
 * Screens gate these behind the user's vibration setting.
 */
const enabled = Platform.OS !== 'web';

export const tap = () => {
  if (!enabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export const thud = () => {
  if (!enabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
};

export const heavy = () => {
  if (!enabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
};

export const success = () => {
  if (!enabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
};

export const failure = () => {
  if (!enabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
};

export const warn = () => {
  if (!enabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
};
