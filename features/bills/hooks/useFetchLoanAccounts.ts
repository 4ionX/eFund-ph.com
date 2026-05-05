import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLoanAccounts } from '../api/loanAccount.api';
import { mapSnakeToCamel } from '@/shared/utils/makeCamelCase';

export const useFetchLoanAccounts = (
  userId?: string,
  limit: number = 10,
  status?: string,
) => {
  return useInfiniteQuery({
    queryKey: ['loanAccounts', userId, status],
    enabled: !!userId,

    initialPageParam: 0,

    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * limit;

      const res = await fetchLoanAccounts(userId!, limit, offset);

      return {
        data: res.data.map(mapSnakeToCamel),
        count: res.count,
      };
    },

    /* ================= SAME LOGIC STYLE ================= */
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < limit) return undefined;

      return allPages.length;
    },
  });
};
