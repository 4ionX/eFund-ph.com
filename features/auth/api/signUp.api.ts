import { router } from 'expo-router';

import { supabaseClient } from '@/core/api/supabaseClient';
import { Alert } from 'react-native';

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (data.user) {
    Alert.alert(
      'Success',
      'Account created successfully! Please check your email to confirm.',
      [
        {
          text: 'OK',
          onPress: () => router.replace('/auth/login'),
        },
      ],
    );
  }

  return data.user;
};
