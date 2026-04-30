import { useRef } from "react";

export const useNavigationLock = () => {
  const lock = useRef(false);

  const safeNavigate = (fn: () => void) => {
    if (lock.current) return;

    lock.current = true;
    fn();

    setTimeout(() => {
      lock.current = false;
    }, 500);
  };

  return safeNavigate;
};