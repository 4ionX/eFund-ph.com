import { supabaseClient } from '@/core/api/supabaseClient';

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  return data.user;
};
