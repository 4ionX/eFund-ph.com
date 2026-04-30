import type { CoBorrower } from '@/features/account/types/co-borrower';
import { create } from 'zustand';

type CoBorrowerState = {
  coBorrowerInfo: CoBorrower | null;
  setCoBorrowerInfo: (data: CoBorrower) => void;
  reset: () => void;
};

export const useCoBorrowerStore = create<CoBorrowerState>((set) => ({
  coBorrowerInfo: null,
  setCoBorrowerInfo: (data) => set({ coBorrowerInfo: data }),
  reset: () => set({ coBorrowerInfo: null }),
}));
