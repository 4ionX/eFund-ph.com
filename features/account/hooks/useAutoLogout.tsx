import { useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import { useLogout } from './useLogout';

const TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const useAutoLogout = () => {
  // ✅ FIX: correct RN timer type
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { performSignOut } = useLogout();

  // =========================
  // RESET TIMER
  // =========================
  const resetTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      console.log('⏳ Auto logout triggered due to inactivity');
      performSignOut();
    }, TIMEOUT);
  }, [performSignOut]);

  // =========================
  // EFFECT (APP STATE)
  // =========================
  useEffect(() => {
    resetTimer();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        resetTimer();
      }
    });

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      subscription.remove();
    };
  }, [resetTimer]);

  // =========================
  // IMPORTANT: expose reset
  // (use this on tap/click globally)
  // =========================
  return { resetTimer };
};
