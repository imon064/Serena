import { Alert, Platform } from 'react-native';

/**
 * Small cross-platform notice. React Native's `Alert.alert` doesn't render on
 * React Native Web, so on web we fall back to the browser's native dialog.
 * Use this for lightweight "tapped" feedback on actions that don't yet have a
 * backend (attachments, voice input, notifications, sharing, etc.).
 */
export function notify(message: string, title?: string): void {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(title ? `${title}\n\n${message}` : message);
  } else {
    Alert.alert(title ?? '', message);
  }
}
