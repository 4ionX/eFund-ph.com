import { Spacing } from '@/shared/constants/theme';

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useDocumentInformationStore } from '@/store/documents.store';
import DocumentsForm from '@/features/account/components/DocumentsForm';
import { ThemedView } from '@/shared/components/theme/ThemedView';

const DocumentsScreen = () => {
  const { documentsInfo } = useDocumentInformationStore();

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
          <DocumentsForm initialData={documentsInfo ?? undefined} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default DocumentsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.sm,
  },
});
