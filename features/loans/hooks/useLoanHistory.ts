import { useCallback, useMemo } from 'react';
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

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, refetch } =
    useFetchLoanApplications(userId, 4, selectedTab);

  const loans = useMemo(() => {
    return data?.pages?.flatMap((p) => p.data) ?? [];
  }, [data]);

  const onChangeTab = useCallback(
    (tab: string) => {
      const index = tabs.findIndex((t) => t === tab);
      handleTabPress(tab as any, index);
    },
    [handleTabPress, tabs],
  );

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetching) return;
    fetchNextPage();
  }, [hasNextPage, isFetching, fetchNextPage]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    tabs,
    selectedTab,
    handleTabPress: onChangeTab,
    loans,
    isLoading,
    isFetching,
    loadMore,
    onRefresh,
  };
};
