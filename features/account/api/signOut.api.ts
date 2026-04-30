import { supabaseClient } from '@/core/api/supabaseClient';

export const signOutApi = async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
};
