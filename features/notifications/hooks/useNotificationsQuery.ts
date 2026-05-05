import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@/core/api/supabaseClient';

export const useNotificationsQuery = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 0,
  });
};
