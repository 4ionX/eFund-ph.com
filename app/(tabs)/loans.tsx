import { router } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import TabHeader from '@/shared/components/ui/TabHeader';
import TopTabNavigator from '@/shared/components/ui/TopTabNavigator';

import { useAuthStore } from '@/store/auth.store';

import { ThemedView } from '@/shared/components/theme/ThemedView';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import LoanListCard from '@/features/loans/components/LoanListCard';
import { useLoanHistory } from '@/features/loans/hooks/useLoanHistory';

const LoanHistoryScreen = () => {
  const user = useAuthStore((s) => s.user);

  const {
    tabs,
    isLoading,
    selectedTab,
    handleTabPress,
    loans,
    refreshing,
    onRefresh,
  } = useLoanHistory({
    userId: user?.id,
  });

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <TabHeader
        leftIconName="chevron-back-outline"
        title="Loan Applications"
        onBackPress={() => router.back()}
      />

      <TopTabNavigator
        STATUS_TABS={tabs}
        selectedTab={selectedTab}
        handleTabPress={handleTabPress}
      />

      <FlatList
        style={{ flex: 1 }}
        data={loans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          loans.length === 0 && { flex: 1 },
        ]}
        refreshing={refreshing || isLoading}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText>{`No ${selectedTab} loan applications yet`}</ThemedText>
          </ThemedView>
        }
        renderItem={({ item }) => (
          <LoanListCard
            loanApplicationId={item.id}
            amount={item.loanAmount}
            date={item.status === 'Pending' ? item.createdAt : item.updatedAt}
            status={item.status}
            loanType={item.loanType}
            provider={item.provider}
            showAction={item.status === 'For Approval'}
          />
        )}
      />
    </ThemedSafeAreaView>
  );
};

export default LoanHistoryScreen;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
