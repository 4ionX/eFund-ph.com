import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TabHeader from '@/shared/components/ui/TabHeader';
import { Spacing, Typography } from '@/shared/constants/theme';
import { router } from 'expo-router';

const PRIVACY_POLICY_TEXT = `
1. Introduction
eFund Financial Services (“we”, “our”, “us”) is a mobile application designed for our clients in Ilocos Sur. This Privacy Policy explains how we collect, use, and protect your personal information when you use our app.

2. Information We Collect
- Personal Information: Name, contact number, address, birth date, civil status.
- Documents: Identification cards and optional business documents you upload.
- Device Information: Device type, OS version, app usage statistics.

3. How We Use Your Information
Your information is used solely for:
- Managing client profiles and services.
- Verifying your identity and documents.
- Communicating updates, promotions, and notifications.
- Ensuring security and preventing fraud.

4. Sharing Your Information
We do not sell or share your data with third parties except:
- When required by law.
- With trusted service providers who help us operate the app.

5. Your Rights
- Access and Correction: You can request to view or correct your data.
- Deletion: You can request us to delete your personal information.
- Consent Withdrawal: You can withdraw consent to data collection anytime.

6. Security
We use reasonable safeguards, but no method is 100% secure.

7. Children’s Privacy
Our app is intended for users 18 years and older.

8. Contact
Email: jey31vee@gmail.com
Phone: +639455517086
`;

const PrivacyPolicyScreen = () => {
  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <TabHeader
        title="Privacy Policy"
        leftIconName="chevron-back-outline"
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText style={styles.text}>{PRIVACY_POLICY_TEXT}</ThemedText>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  text: {
    fontSize: Typography.size.sm,
    lineHeight: 20,
  },
});
