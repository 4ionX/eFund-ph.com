import { useQuery } from '@tanstack/react-query';
import { fetchLoanApplications } from '../api/loanApplication.api';
import type { LoanApplication, LoanStatus } from '../types/loans';

const mapSnakeToCamel = (data: any): LoanApplication => ({
  id: data.id,

  loanType: data.loan_type,
  loanAmount: data.loan_amount,

  disbursementMethod: data.disbursement_method,
  accountName: data.account_name,
  accountNumber: data.account_number,

  provider: data.provider,
  status: data.status as LoanStatus,

  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const useFetchLoanApplications = (
  userId?: string,
  page: number = 0,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: ['loanApplications', userId, page, limit],
    enabled: !!userId,

    queryFn: async () => {
      const offset = page * limit;

      const res = await fetchLoanApplications(userId!, limit, offset);

      return {
        ...res,
        data: res.data.map(mapSnakeToCamel),
      };
    },

    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
};
