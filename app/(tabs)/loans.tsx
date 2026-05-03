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
    <ThemedSafeAreaView style={styles.container}>
      <TabHeader
        leftIconName="chevron-back-outline"
        title="Loan Applications"
        onBackPress={() => router.back()}
      />

      {/* FIX: wrap tabs + list in flex container */}
      <ThemedView style={styles.content}>
        <TopTabNavigator
          STATUS_TABS={tabs}
          selectedTab={selectedTab}
          handleTabPress={handleTabPress}
        />

        <FlatList
          style={styles.list}
          data={loans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            loans.length === 0 && { flex: 1 },
          ]}
          refreshing={refreshing || isLoading}
          onRefresh={onRefresh}
          ListFooterComponent={<ThemedView style={{ height: 50 }} />}
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
              showAction={item.status === 'For Approval'}
            />
          )}
        />
      </ThemedView>
    </ThemedSafeAreaView>
  );
};

export default LoanHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // 🔥 VERY IMPORTANT
  },

  content: {
    flex: 1, // 🔥 allows FlatList to take remaining space
  },

  list: {
    flex: 1, // 🔥 enables scrolling on web
  },

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
