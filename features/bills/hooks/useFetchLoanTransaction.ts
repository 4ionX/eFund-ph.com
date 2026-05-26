import { useQuery } from '@tanstack/react-query';
import { fetchLoanTransactions } from '../api/loanAccount.api';

export const useFetchLoanTransactions = (loanAccountId?: string) => {
  return useQuery({
    queryKey: ['loanTransactions', loanAccountId],

    queryFn: async () => {
      if (!loanAccountId) {
        throw new Error('loanAccountId is required');
      }

      return fetchLoanTransactions(loanAccountId);
    },

    enabled: !!loanAccountId,

    staleTime: 0,
    retry: 1,
  });
};
