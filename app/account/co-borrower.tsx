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

import { useCoBorrowerStore } from '@/store/coBorrower.store';
import CoBorrowerForm from '@/features/account/components/CoBorrowerForm';
import { ThemedView } from '@/shared/components/theme/ThemedView';

const CoBorrowerScreen = () => {
  const { coBorrowerInfo } = useCoBorrowerStore();

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
          <CoBorrowerForm initialData={coBorrowerInfo ?? undefined} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default CoBorrowerScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.sm,
  },
});
