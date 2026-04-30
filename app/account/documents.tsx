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

import { useDocumentInformationStore } from '@/store/documents.store';
import DocumentsForm from '@/features/account/components/DocumentsForm';

const DocumentsScreen = () => {
  const { documentsInfo } = useDocumentInformationStore();

  return (
    <ThemedSafeAreaView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TabHeader
          title="Documents Upload"
          leftIconName="chevron-back-outline"
          onBackPress={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <DocumentsForm initialData={documentsInfo ?? undefined} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedSafeAreaView>
  );
};

export default DocumentsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.sm,
  },
});
