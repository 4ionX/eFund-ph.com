import { StyleSheet } from 'react-native';
import { Spacing } from '@/shared/constants/theme';
import { ThemedView } from '../theme/ThemedView';

export const Section = ({ children }: { children: React.ReactNode }) => (
  <ThemedView style={styles.field}>{children}</ThemedView>
);
const styles = StyleSheet.create({
  field: {
    marginBottom: Spacing.md,
  },

  buttonWrapper: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
});
