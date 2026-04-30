import { useQuery } from '@tanstack/react-query';
import { mapSnakeToCamel } from '@/shared/utils/makeCamelCase';
import { fetchLoanContract } from '../api/loanApplication.api';

export const useFetchLoanContract = (
  userId: string,
  loanApplicationId: string,
) => {
  return useQuery({
    queryKey: ['loanDetails', userId, loanApplicationId],
    enabled: !!userId && !!loanApplicationId,

    queryFn: async () => {
      const res = await fetchLoanContract(userId!, loanApplicationId);

      return {
        // Directly map the personalInfo object, no need for [0]
        personalInfo: res.personalInfo
          ? mapSnakeToCamel(res.personalInfo)
          : null,

        // Directly map the coBorrowers object, no need for [0]
        coBorrowers: res.coBorrowers ? mapSnakeToCamel(res.coBorrowers) : null,

        // Contract info may still need to be mapped if it's an array
        contractInfo: res.contractInfo
          ? mapSnakeToCamel(res.contractInfo)
          : null,
      };
    },

    staleTime: 1000 * 60 * 5,
  });
};
