import { useEffect } from 'react';
import { supabaseClient } from '@/core/api/supabaseClient';

export const useNotificationsRealtime = (
  userId: string,
  onNew: (payload: any) => void,
) => {
  useEffect(() => {
    if (!userId) return;

    const channel = supabaseClient
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onNew(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [userId, onNew]);
};
