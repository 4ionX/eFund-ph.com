import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/auth.store';
import useBillsTabNavigator from './useBillsTabNavigator';
import { useFetchLoanAccounts } from './useFetchLoanAccounts';

const normalize = (v?: string) => v?.toLowerCase().replace(/\s+/g, '_');

export const useBills = () => {
  const userId = useAuthStore((s) => s.user?.id);

  const {
    states: { tabs, selectedTab },
    actions: { handleTabPress },
  } = useBillsTabNavigator();

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useFetchLoanAccounts(userId, 10, selectedTab);

  /* ================= FLATTEN ================= */
  const allBills = useMemo(() => {
    return data?.pages?.flatMap((p) => p.data) ?? [];
  }, [data]);

  /* ================= MAP ================= */
  const bills = useMemo(() => {
    return allBills.map((item: any) => {
      const account = item.loanAccounts;

      return {
        id: item.id,
        amount: item.approvedAmount ?? 0,
        referenceNumber: `EF-${item.id.slice(0, 6).toUpperCase()}`,
        date: item.releasedAt
          ? new Date(item.releasedAt).toDateString()
          : 'N/A',
        status: account?.status ?? 'Unknown',
        loanType: item.loanType ?? 'Loan',
        loanAccountId: account?.id,
      };
    });
  }, [allBills]);

  /* ================= FILTER ================= */
  const filteredBills = useMemo(() => {
    return bills.filter(
      (item: any) => normalize(item.status) === normalize(selectedTab),
    );
  }, [bills, selectedTab]);

  /* ================= PAGINATION ================= */
  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetching) return;
    fetchNextPage();
  }, [hasNextPage, isFetching, fetchNextPage]);

  /* ================= REFRESH ================= */
  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  /* ================= TAB CHANGE ================= */
  const onTabChange = useCallback(
    (tab: string) => {
      const index = tabs.findIndex((t) => t === tab);
      handleTabPress(tab as any, index);
    },
    [tabs, handleTabPress],
  );

  return {
    tabs,
    selectedTab,

    bills: filteredBills,

    isLoading,
    isRefetching,

    loadMore,
    onRefresh,
    handleTabPress: onTabChange,
  };
};
