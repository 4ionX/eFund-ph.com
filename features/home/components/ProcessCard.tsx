import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, IconSize, Radius, Spacing } from '@/shared/constants/theme';
import { ThemedText } from '../../../shared/components/theme/ThemedText';
import { ThemedView } from '../../../shared/components/theme/ThemedView';

const ProcessCard = () => {
  return (
    <ThemedView style={styles.card}>
      <View style={styles.innerCard}>
        <View style={styles.iconRow}>
          <View style={styles.iconItem}>
            <Ionicons
              name="person-outline"
              size={IconSize.lg}
              color={Colors.brand.primary}
            />
            <ThemedText type="caption">Register</ThemedText>
          </View>
          <Ionicons
            name="arrow-forward"
            size={IconSize.lg}
            color={Colors.brand.secondary}
          />
          <View style={styles.iconItem}>
            <Ionicons
              name="document-text-outline"
              size={IconSize.lg}
              color={Colors.brand.primary}
            />
            <ThemedText type="caption">Requirements</ThemedText>
          </View>
          <Ionicons
            name="arrow-forward"
            size={IconSize.lg}
            color={Colors.brand.secondary}
          />
          <View style={styles.iconItem}>
            <Ionicons
              name="wallet-outline"
              size={IconSize.lg}
              color={Colors.brand.primary}
            />
            <ThemedText type="caption">Get quota</ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
};

export default ProcessCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: Spacing.md,
  },

  innerCard: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconItem: {
    alignItems: 'center',
  },

  card: {
    padding: Spacing.md,
    margin: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.semantic.disabled,
  },
});
