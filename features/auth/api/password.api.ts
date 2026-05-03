import { supabaseClient } from '@/core/api/supabaseClient';
import { Platform } from 'react-native';

export const sendPasswordResetEmail = async (email: string) => {
  const redirectTo =
    Platform.OS === 'web'
      ? `${window.location.origin}/auth/reset-password`
      : 'efund://auth/reset-password';

  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
    email,
    {
      redirectTo,
    },
  );

  if (error) throw error;
  return data;
};

export const updatePassword = async (newPassword: string) => {
  const session = await supabaseClient.auth.getSession();
  const user = session.data.session?.user;

  if (!user) throw new Error('No authenticated user found');

  const { data, error } = await supabaseClient.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;

  return data.user;
};
