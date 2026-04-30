import { useAuthStore } from '@/store/auth.store';
import { useEffect, useState } from 'react';
import { getSession, onAuthStateChange } from '../api/session.api';

export const useAuth = () => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const session: any = await getSession();
        if (isMounted) {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.log('Init auth error:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    const { data: listener } = onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  return {
    user,
    isLoading,
  };
};
