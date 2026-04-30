import { supabaseClient } from '@/core/api/supabaseClient';
import * as AuthSession from 'expo-auth-session';

export const sendPasswordResetEmail = async (email: string) => {
  const redirectTo = AuthSession.makeRedirectUri({
    scheme: 'efund',
    path: 'auth/reset-password',
  });

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
