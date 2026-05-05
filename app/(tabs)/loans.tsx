import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import TabHeader from '@/shared/components/ui/TabHeader';
import TopTabNavigator from '@/shared/components/ui/TopTabNavigator';
import { useAuthStore } from '@/store/auth.store';

import LoanListCard from '@/features/loans/components/LoanListCard';
import { useLoanHistory } from '@/features/loans/hooks/useLoanHistory';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';

const LoanHistoryScreen = () => {
  const user = useAuthStore((s) => s.user);

  const {
    tabs,
    selectedTab,
    handleTabPress,
    loans,
    isLoading,
    onRefresh,
    loadMore,
  } = useLoanHistory({
    userId: user?.id,
  });

  return (
    <ThemedSafeAreaView style={styles.container}>
      <TabHeader
        leftIconName="chevron-back-outline"
        title="Loan Status"
        onBackPress={() => router.back()}
      />

      <ThemedView style={styles.content}>
        <TopTabNavigator
          STATUS_TABS={tabs}
          selectedTab={selectedTab}
          handleTabPress={handleTabPress}
        />

        <FlatList
          style={{ flex: 1 }}
          data={loans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContainer, { flexGrow: 1 }]}
          refreshing={isLoading}
          onRefresh={onRefresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            isLoading ? null : (
              <ThemedView style={styles.emptyContainer}>
                <ThemedText>
                  {`No ${selectedTab} loan applications yet`}
                </ThemedText>
              </ThemedView>
            )
          }
          renderItem={({ item }) => (
            <LoanListCard
              loanApplicationId={item.id}
              amount={item.loanAmount}
              date={item.status === 'Pending' ? item.createdAt : item.updatedAt}
              status={item.status}
              loanType={item.loanType}
              showAction={item.status === 'For Approval'}
            />
          )}
          ListFooterComponent={() => <View style={{ height: 50 }} />}
        />
      </ThemedView>
    </ThemedSafeAreaView>
  );
};

export default LoanHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
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
