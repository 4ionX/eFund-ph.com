import { supabaseClient } from '@/core/api/supabaseClient';

export const markAsRead = async (id: string) => {
  const { data, error } = await supabaseClient
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select();

  console.log('UPDATED DATA:', data);
  console.log('ERROR:', error);

  if (error) throw error;

  return data;
};
