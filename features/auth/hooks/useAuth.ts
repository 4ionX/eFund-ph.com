import { useAuthStore } from '@/store/auth.store';
import { useEffect, useState } from 'react';
import { getSession } from '../api/session.api';
import { router } from 'expo-router';
import { supabaseClient } from '@/core/api/supabaseClient';

export const useAuth = () => {
  const { user, setUser } = useAuthStore();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const onAuthStateChange = (callback: (event: any, session: any) => void) => {
    return supabaseClient.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const session = await getSession();

        if (!isMounted) return;

        setSession(session ?? null);
        setUser(session?.user ?? null);
      } catch (error) {
        console.log('Init auth error:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    init();

    const { data: listener } = onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (event === 'PASSWORD_RECOVERY') {
        router.replace('/auth/reset-password');
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  return {
    user,
    session,
    isLoading,
  };
};
