import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TabHeader from '@/shared/components/ui/TabHeader';
import { Spacing, Typography } from '@/shared/constants/theme';
import { router } from 'expo-router';

const PRIVACY_POLICY_TEXT = `
1. Introduction
eFund is a mobile application designed to provide financial services and loan-related features for our users.

2. Camera Usage
eFund uses camera access only for app functionality such as scanning documents or capturing images required within the app.

We do not use the camera for any background tracking or unauthorized recording.

3. Information We Collect
We may collect the following information:
- Personal Information: name, contact number, address, birth date, civil status
- Documents: valid IDs and supporting documents uploaded by the user
- App Data: basic usage data for app functionality and improvement

4. How We Use Your Information
Your information is used only for:
- Account and profile management
- Loan processing and verification
- Document validation
- App functionality and service improvement

5. Data Sharing
We do not sell your personal data.

We may only share information:
- When required by law
- With trusted service providers necessary for app operation

6. Data Security
We implement reasonable security measures to protect your data. However, no system is 100% secure.

7. Data Retention
We retain your data only as long as necessary to provide our services.

8. Children’s Privacy
This app is intended for users 18 years old and above.

9. Your Rights
You may request:
- Access to your data
- Correction of incorrect data
- Deletion of your account and data

10. Contact Us
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
