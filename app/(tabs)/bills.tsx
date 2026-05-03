import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';

import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import TabHeader from '@/shared/components/ui/TabHeader';
import TopTabNavigator from '@/shared/components/ui/TopTabNavigator';
import { useAuthStore } from '@/store/auth.store';
import useBillsTabNavigator from '@/features/bills/hooks/useBillsTabNavigator';
import BillsCard from '@/features/bills/components/BillsCard';
import { useFetchLoanAccounts } from '@/features/bills/hooks/useFetchLoanAccounts';
import { ThemedView } from '@/shared/components/theme/ThemedView';

const BillsScreen = () => {
  const {
    states: { tabs, selectedTab },
    actions: { handleTabPress },
  } = useBillsTabNavigator();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;
  // 🔥 GET REAL DATA
  const { data, isLoading, isRefetching, refetch } = useFetchLoanAccounts(
    userId,
    0,
    10,
  );

  // =========================
  // MAP API → BILLS FORMAT
  // =========================
  const bills = useMemo(() => {
    return (data?.data ?? []).map((item: any) => {
      const account = item.loanAccounts; // ✅ FIX HERE

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
  }, [data]);

  // =========================
  // FILTER BY TAB
  // =========================
  const filteredLoans = useMemo(
    () => bills.filter((loan: any) => loan.status === selectedTab),
    [bills, selectedTab],
  );

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <TabHeader
        leftIconName="chevron-back-outline"
        title="Loan Accounts"
        onBackPress={() => router.back()}
      />
      <ThemedView style={styles.content}>
        <TopTabNavigator
          STATUS_TABS={tabs}
          selectedTab={selectedTab}
          handleTabPress={handleTabPress}
        />

        {/* LOADING */}
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredLoans}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={<ThemedView style={{ height: 50 }} />}
            renderItem={({ item }) => (
              <BillsCard
                amount={item.amount}
                referenceNumber={item.referenceNumber}
                date={item.date}
                status={item.status}
                loanType={item.loanType}
                showAction={item.status !== 'Closed'}
                loanAccountId={item.loanAccountId}
              />
            )}
            // ✅ REFRESH CONTROL
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        )}
      </ThemedView>
    </ThemedSafeAreaView>
  );
};

export default BillsScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
