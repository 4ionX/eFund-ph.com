import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import { router } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import LoanApplicationForm from '@/features/loans/components/LoanApplicationForm';
import TabHeader from '@/shared/components/ui/TabHeader';

import { Spacing } from '@/shared/constants/theme';
import { useLoanApplicationForm } from '@/features/loans/hooks/useLoanApplicationForm';

const LoanApplicationScreen = () => {
  const form = useLoanApplicationForm();

  return (
    <ThemedSafeAreaView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TabHeader
          title="Loan Application"
          leftIconName="chevron-back-outline"
          onBackPress={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <LoanApplicationForm {...form} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedSafeAreaView>
  );
};

export default LoanApplicationScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.md,
  },
});
