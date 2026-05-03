import { supabaseClient } from '@/core/api/supabaseClient';
import { showAlert } from '@/shared/utils/ShowAlert';
import { router } from 'expo-router';

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    showAlert('Error', error.message);
    throw error;
  }

  if (data.user) {
    showAlert(
      'Success',
      'Account created successfully! Please check your email to confirm.',
      () => {
        router.replace('/auth/login');
      },
    );
  }

  return data.user;
};
