import { create } from 'zustand';

interface AuthStore {
  user: any | null;
  setUser: (user: any | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  reset: () => set({ user: null }),
}));
