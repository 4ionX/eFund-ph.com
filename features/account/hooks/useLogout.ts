import { useAuthStore } from '@/store/auth.store';
import { usePersonalInformationStore } from '@/store/personalInformation.store';
import { useCoBorrowerStore } from '@/store/coBorrower.store';
import { useContactReferenceStore } from '@/store/contactReference.store';

import { useState } from 'react';
import { Alert } from 'react-native';
import { signOutApi } from '../api/signOut.api';
import { useDocumentInformationStore } from '@/store/documents.store';
import { useLoanApplications } from '@/store/loans.store';

export const useLogout = () => {
  // ✅ get resets here (top level)
  const { reset: authReset } = useAuthStore();
  const { reset: personalReset } = usePersonalInformationStore();
  const { reset: coBorrowerReset } = useCoBorrowerStore();
  const { reset: contactReset } = useContactReferenceStore();
  const { reset: documentReset } = useDocumentInformationStore();
  const { reset: loanReset } = useLoanApplications();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ use them here
  const resetAllStores = () => {
    authReset();
    personalReset();
    coBorrowerReset();
    contactReset();
    documentReset();
    loanReset();
  };

  const performSignOut = async () => {
    setLoading(true);
    try {
      await signOutApi();

      // 🔥 RESET ALL
      resetAllStores();

      Alert.alert('Success', 'You have been logged out.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: performSignOut },
    ]);
  };

  return {
    loading,
    errors,
    signOut,
  };
};
