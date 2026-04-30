import { ImagesPath } from '@/shared/constants/images';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from '../../../shared/components/theme/ThemedText';
import { ThemedView } from '../../../shared/components/theme/ThemedView';
import { Colors, Radius, Spacing } from '@/shared/constants/theme';

const AboutCard = () => {
  return (
    <ThemedView style={styles.card}>
      <View style={styles.innerCard}>
        {/* Center Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={ImagesPath.logo}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="default" style={styles.logoTitle}>
            eFund Financial Services
          </ThemedText>
          <ThemedText type="caption" style={styles.logoTagline}>
            Life made easy
          </ThemedText>
        </View>

        {/* Stats Row */}
        <View style={styles.row}>
          <View style={styles.column}>
            <ThemedText type="defaultSemiBold">7 years</ThemedText>
            <ThemedText type="description">Trusted service</ThemedText>
          </View>

          <View style={styles.column}>
            <ThemedText type="defaultSemiBold">2k+</ThemedText>
            <ThemedText type="description">Borrowers</ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
};

export default AboutCard;

const styles = StyleSheet.create({
  innerCard: {
    padding: Spacing.md,
    borderRadius: Radius.md,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },

  column: {
    alignItems: 'center',
    flex: 1,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: -34,
  },

  logo: {
    width: 160,
    height: 160,
  },

  logoTitle: {
    marginTop: -34,
  },

  logoTagline: {
    marginTop: 2,
  },

  card: {
    padding: Spacing.md,
    margin: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.semantic.disabled,
  },
});
