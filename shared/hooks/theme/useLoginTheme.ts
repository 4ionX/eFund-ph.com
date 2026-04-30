import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from 'react-native';

export function useLoginTheme() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || 'light'];

  return {
    appleBg: theme.text,
    appleText: theme.background,
    googleBg: theme.background,
    googleText: theme.text,
    googleBorder: theme.border,
  };
}
