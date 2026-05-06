import { useAuthStore } from '@/store/auth.store';
import { usePersonalInformationStore } from '@/store/personalInformation.store';
import { useCoBorrowerStore } from '@/store/coBorrower.store';
import { useContactReferenceStore } from '@/store/contactReference.store';
import { useDocumentInformationStore } from '@/store/documents.store';
import { useLoanApplications } from '@/store/loans.store';

import { useState } from 'react';
import { Platform } from 'react-native';
import { signOutApi } from '../api/signOut.api';

export const useLogout = () => {
  // ✅ stores
  const { reset: authReset } = useAuthStore();
  const { reset: personalReset } = usePersonalInformationStore();
  const { reset: coBorrowerReset } = useCoBorrowerStore();
  const { reset: contactReset } = useContactReferenceStore();
  const { reset: documentReset } = useDocumentInformationStore();
  const { reset: loanReset } = useLoanApplications();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ reset all stores
  const resetAllStores = () => {
    authReset();
    personalReset();
    coBorrowerReset();
    contactReset();
    documentReset();
    loanReset();
  };

  // ✅ cross-platform alert helper
  const showAlert = (title: string, message?: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${message ?? ''}`);
    } else {
      const { Alert } = require('react-native');
      Alert.alert(title, message);
    }
  };

  // ✅ actual logout
  const performSignOut = async () => {
    setLoading(true);

    try {
      await signOutApi();

      resetAllStores();

      showAlert('You have been logged out.');
    } catch (error: any) {
      setErrors({ general: error.message });
      showAlert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ confirm logout (web + native safe)
  const signOut = () => {
    if (Platform.OS === 'web') {
      const ok = window.confirm('Are you sure you want to log out?');
      if (ok) performSignOut();
      return;
    }

    const { Alert } = require('react-native');

    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: performSignOut },
    ]);
  };

  return {
    loading,
    errors,
    signOut,
    performSignOut,
  };
};
