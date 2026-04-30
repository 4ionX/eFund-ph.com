import { supabaseClient } from '@/core/api/supabaseClient';

export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabaseClient.auth.onAuthStateChange((_event, session) => {
    const currentUser = session?.user ?? null;
    callback(currentUser);
  });
};

export const getSession = async () => {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) throw error;

  return data.session;
};
