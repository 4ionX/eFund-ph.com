import TabHeader from '@/shared/components/ui/TabHeader';
import { Spacing } from '@/shared/constants/theme';
import { router } from 'expo-router';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useContactReferenceStore } from '@/store/contactReference.store';
import ContactReferenceForm from '@/features/account/components/ContactReferenceForm';
import { ThemedView } from '@/shared/components/theme/ThemedView';

const ContactReferencesScreen = () => {
  const { contactInfo } = useContactReferenceStore();

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
          <ContactReferenceForm initialData={contactInfo || []} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default ContactReferencesScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.sm,
  },
});
