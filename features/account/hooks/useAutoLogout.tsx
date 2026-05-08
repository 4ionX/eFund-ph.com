import { useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import { useLogout } from './useLogout';

const TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const useAutoLogout = () => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { performSignOut } = useLogout();

  const resetTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(async () => {
      console.log('⏳ Auto logout triggered (inactivity)');
      await performSignOut();
    }, TIMEOUT);
  }, [performSignOut]);

  useEffect(() => {
    resetTimer();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        resetTimer();
      }
    });

    return () => {
      if (timer.current) clearTimeout(timer.current);
      subscription.remove();
    };
  }, [resetTimer]);

  return { resetTimer };
};
