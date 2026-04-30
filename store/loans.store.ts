import type { LoanApplication } from '@/features/loans/types/loans';
import { create } from 'zustand';

type LoanApplicationState = {
  loanInfo: LoanApplication | null;
  setLoanInfo: (data: LoanApplication) => void;
  reset: () => void;
};

export const useLoanApplications = create<LoanApplicationState>((set) => ({
  loanInfo: null,
  setLoanInfo: (data) => set({ loanInfo: data }),
  reset: () => set({ loanInfo: null }),
}));
