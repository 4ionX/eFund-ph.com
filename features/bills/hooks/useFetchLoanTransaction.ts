import { useQuery } from '@tanstack/react-query';
import { fetchLoanTransactions } from '../api/loanAccount.api';

export const useFetchLoanTransactions = (
  loanAccountId?: string,
  limit: number = 10,
  offset: number = 0,
) => {
  return useQuery({
    queryKey: ['loanTransactions', loanAccountId, limit, offset],

    queryFn: async () => {
      if (!loanAccountId) {
        throw new Error('loanAccountId is required');
      }

      return fetchLoanTransactions(loanAccountId, limit, offset);
    },

    enabled: !!loanAccountId,

    staleTime: 0,
    retry: 1,
  });
};
