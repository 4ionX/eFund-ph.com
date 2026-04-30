import { useQuery } from '@tanstack/react-query';
import { fetchLoanAccounts } from '../api/loanAccount.api';
import { mapSnakeToCamel } from '@/shared/utils/makeCamelCase';

export const useFetchLoanAccounts = (
  userId?: string,
  page: number = 0,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: ['loanAccounts', userId, page, limit],
    enabled: !!userId,

    queryFn: async () => {
      const offset = page * limit;

      const res = await fetchLoanAccounts(userId!, limit, offset);

      return {
        ...res,
        data: (res.data ?? []).map((item: any) => mapSnakeToCamel(item)),
      };
    },

    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
};
