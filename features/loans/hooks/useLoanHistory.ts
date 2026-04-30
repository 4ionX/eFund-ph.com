import { useCallback, useMemo, useState } from 'react';
import type { LoanApplication } from '@/features/loans/types/loans';
import { useFetchLoanApplications } from './useFetchLoanApplication';
import useLoanTabNavigator from './useLoanTabNavigator';

type Params = {
  userId?: string;
};

export const useLoanHistory = ({ userId }: Params) => {
  const {
    states: { tabs, selectedTab },
    actions: { handleTabPress },
  } = useLoanTabNavigator();

  const [refreshing, setRefreshing] = useState(false);

  const { data, refetch, isLoading } = useFetchLoanApplications(userId, 0, 10);

  const filteredLoans = useMemo(() => {
    const loans = data?.data ?? [];

    return loans.filter((loan: LoanApplication) => loan.status === selectedTab);
  }, [data?.data, selectedTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    tabs,
    selectedTab,
    handleTabPress,
    loans: filteredLoans,
    refreshing,
    onRefresh,
    isLoading,
  };
};
