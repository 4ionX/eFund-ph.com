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

import { useCoBorrowerStore } from '@/store/coBorrower.store';
import CoBorrowerForm from '@/features/account/components/CoBorrowerForm';

const CoBorrowerScreen = () => {
  const { coBorrowerInfo } = useCoBorrowerStore();

  return (
    <ThemedSafeAreaView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TabHeader
          title="Co-Borrower Information"
          leftIconName="chevron-back-outline"
          onBackPress={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CoBorrowerForm initialData={coBorrowerInfo ?? undefined} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedSafeAreaView>
  );
};

export default CoBorrowerScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.sm,
  },
});
