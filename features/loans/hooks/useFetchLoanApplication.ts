import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLoanApplications } from '../api/loanApplication.api';
import { mapSnakeToCamel } from '@/shared/utils/makeCamelCase';

export const useFetchLoanApplications = (
  userId?: string,
  limit: number = 10,
  status?: string,
) => {
  return useInfiniteQuery({
    queryKey: ['loanApplications', userId, status],
    enabled: !!userId,
    initialPageParam: 0,

    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * limit;

      const res = await fetchLoanApplications(userId!, limit, offset, status);

      return {
        data: res.data.map(mapSnakeToCamel),
        count: res.count,
      };
    },

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < limit) return undefined;

      return allPages.length;
    },
  });
};
