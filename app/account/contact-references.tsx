import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
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

const ContactReferencesScreen = () => {
  const { contactInfo } = useContactReferenceStore();

  return (
    <ThemedSafeAreaView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TabHeader
          title="Contact References"
          leftIconName="chevron-back-outline"
          onBackPress={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ContactReferenceForm initialData={contactInfo || []} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedSafeAreaView>
  );
};

export default ContactReferencesScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.sm,
  },
});
