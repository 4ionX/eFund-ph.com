import { Alert, Platform } from 'react-native';

export const showAlert = (
  title: string,
  message?: string,
  _p0?: () => void,
) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message ?? ''}`);
  } else {
    Alert.alert(title, message);
  }
};
