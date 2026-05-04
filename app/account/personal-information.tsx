import { Spacing } from '@/shared/constants/theme';

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { usePersonalInformationStore } from '@/store/personalInformation.store';
import PersonalInformationForm from '@/features/account/components/PersonalInformationForm';
import { ThemedView } from '@/shared/components/theme/ThemedView';

const PersonalInformationScreen = () => {
  const { personalInfo } = usePersonalInformationStore();

  return (
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PersonalInformationForm initialData={personalInfo ?? undefined} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default PersonalInformationScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.sm,
  },
});
