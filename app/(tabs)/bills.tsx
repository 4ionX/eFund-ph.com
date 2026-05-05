import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';

import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import TabHeader from '@/shared/components/ui/TabHeader';
import TopTabNavigator from '@/shared/components/ui/TopTabNavigator';
import { ThemedView } from '@/shared/components/theme/ThemedView';

import BillsCard from '@/features/bills/components/BillsCard';
import { useBills } from '@/features/bills/hooks/useBills';
import { ThemedText } from '@/shared/components/theme/ThemedText';

const BillsScreen = () => {
  const {
    tabs,
    selectedTab,
    handleTabPress,
    bills,
    isLoading,
    loadMore,
    onRefresh,
  } = useBills();

  const isInitialLoading = isLoading;

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

        {isInitialLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={bills}
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
            ListFooterComponent={() => <ThemedView style={{ height: 50 }} />}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
