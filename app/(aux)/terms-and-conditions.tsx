import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TabHeader from '@/shared/components/ui/TabHeader';
import { Spacing, Typography } from '@/shared/constants/theme';
import { router } from 'expo-router';

const TERMS_TEXT = `
1. Acceptance
By using eFund Financial Services, you agree to these Terms & Conditions and our Privacy Policy.

2. Use of the App
- Provide accurate and complete information.
- Upload valid identification documents.

3. User Responsibilities
- Keep account and documents confidential.
- Do not use the app for illegal purposes.

4. Intellectual Property
All content, branding, and software are owned by eFund Financial Services.

5. Limitation of Liability
- We are not liable for any damages from use of the app.
- Not responsible for loss of uploaded documents despite reasonable security measures.

6. Modification of Terms
We may update Terms anytime. Changes are effective upon posting in-app or online.

7. Governing Law
These Terms are governed by the laws of the Philippines.

8. Contact
Email: jey31vee@gmail.com
Phone: +639455517086
`;

const TermsConditionsScreen = () => {
  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <TabHeader
        title="Terms & Conditions"
        leftIconName="chevron-back-outline"
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText style={styles.text}>{TERMS_TEXT}</ThemedText>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

export default TermsConditionsScreen;

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
