import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';
import { Radius, Spacing } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { BillStatus } from '../types/loan-accounts';

type Props = {
  amount: number;
  referenceNumber: string;
  date: string;
  status: BillStatus;
  loanType: string;
  showAction: boolean;
  loanAccountId: string;
};

const statusColors: Record<BillStatus, string> = {
  Active: '#10B981',
  Closed: '#EF4444',
};

const BillsCard = ({
  amount,
  referenceNumber,
  date,
  status,
  loanType,
  showAction,
  loanAccountId,
}: Props) => {
  const cardColor = useThemeColor({}, 'card');

  return (
    <ThemedView style={[styles.card, { backgroundColor: cardColor }]}>
      {/* Header */}
      <View style={styles.rowBetween}>
        <ThemedText type="defaultSemiBold">
          ₱ {amount.toLocaleString()}
        </ThemedText>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[status] },
          ]}
        >
          <ThemedText style={styles.statusText}>{status}</ThemedText>
        </View>
      </View>

      {/* Details */}
      <View style={{ marginVertical: Spacing.sm }}>
        <ThemedText type="description">Loan type: {loanType}</ThemedText>
        <ThemedText type="description">Ref ID: {referenceNumber}</ThemedText>
        <ThemedText type="description">Date Released: {date}</ThemedText>
      </View>

      {/* Action button */}
      {showAction && (
        <AnimatedButton
          onPress={() =>
            router.push({
              pathname: '/bills/payment',
              params: { loanAccountId },
            })
          }
          label="Pay Bills"
        />
      )}
    </ThemedView>
  );
};

export default BillsCard;

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    elevation: 3, // Android
    shadowColor: '#000', // iOS
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
});
