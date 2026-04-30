import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import EFImage from '@/shared/components/ui/EFImage';
import TabHeader from '@/shared/components/ui/TabHeader';
import { ImagesPath } from '@/shared/constants/images';
import { Spacing } from '@/shared/constants/theme';

import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

const LoanGuidelinesScreen = () => {
  const cardBackgroundColor = useThemeColor({}, 'card');

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <TabHeader
        leftIconName="chevron-back-outline"
        title="Loan Guidelines"
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Step 1 */}
        <ThemedView
          style={[styles.card, { backgroundColor: cardBackgroundColor }]}
        >
          <ThemedText type="subtitle">
            Step 1 – Registration / Personal Information
          </ThemedText>
          <ThemedText>
            Register and complete your account information before applying for a
            loan.
          </ThemedText>

          <EFImage
            style={styles.image}
            source={ImagesPath.step_1}
            contentFit="contain"
            transition={500}
          />
        </ThemedView>

        {/* Step 2 */}
        <ThemedView
          style={[styles.card, { backgroundColor: cardBackgroundColor }]}
        >
          <ThemedText type="subtitle">Step 2 – Upload Documents</ThemedText>
          <ThemedText>Upload valid ID and required documents.</ThemedText>

          <EFImage
            style={styles.image}
            source={ImagesPath.step_2}
            contentFit="contain"
            transition={500}
          />
        </ThemedView>

        {/* Step 3 */}
        <ThemedView
          style={[styles.card, { backgroundColor: cardBackgroundColor }]}
        >
          <ThemedText type="subtitle">Step 3 – Apply for Loan</ThemedText>
          <ThemedText>
            Submit your loan application after completing all requirements.
          </ThemedText>

          <EFImage
            style={styles.image}
            source={ImagesPath.step_3}
            contentFit="contain"
            transition={500}
          />
        </ThemedView>

        {/* Step 4 */}
        <ThemedView
          style={[styles.card, { backgroundColor: cardBackgroundColor }]}
        >
          <ThemedText type="subtitle">Step 4 – Disbursement</ThemedText>
          <ThemedText>
            If your application status is “For Approval,” you can continue to
            the CI process. Once approved, you may sign the contract and wait
            for your loan disbursement.
          </ThemedText>

          <EFImage
            style={styles.image}
            source={ImagesPath.step_4}
            contentFit="contain"
            transition={500}
          />
        </ThemedView>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

export default LoanGuidelinesScreen;

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  card: {
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: Spacing.sm,
    resizeMode: 'contain',
  },
});
