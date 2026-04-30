// features/account/screens/PersonalInformationScreen.tsx
import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import TabHeader from '@/shared/components/ui/TabHeader';
import { Spacing } from '@/shared/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { usePersonalInformationStore } from '@/store/personalInformation.store';
import PersonalInformationForm from '@/features/account/components/PersonalInformationForm';

const PersonalInformationScreen = () => {
  const { personalInfo } = usePersonalInformationStore();

  return (
    <ThemedSafeAreaView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TabHeader
          title="Personal Information"
          leftIconName="chevron-back-outline"
          onBackPress={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PersonalInformationForm initialData={personalInfo ?? undefined} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedSafeAreaView>
  );
};

export default PersonalInformationScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.sm,
  },
});
