import { supabaseClient } from '@/core/api/supabaseClient';
import { showAlert } from '@/shared/utils/ShowAlert';
import { router } from 'expo-router';
import { Platform } from 'react-native';

export const getAuthRedirectUrl = (path: string) => {
  if (Platform.OS === 'web') {
    return `${window.location.origin}${path}`;
  }

  // remove leading slash
  const cleanPath = path.replace(/^\//, '');

  return `efund://${cleanPath}`;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const redirectTo = getAuthRedirectUrl('/auth/callback');

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    showAlert('Error', error.message);
    throw error;
  }

  if (data.user) {
    showAlert('Success', 'Account created successfully!', () => {
      router.replace('/auth/callback');
    });
  }

  return data.user;
};
