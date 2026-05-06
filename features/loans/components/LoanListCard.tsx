import React, { useCallback } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';

import { Radius, Spacing } from '@/shared/constants/theme';

import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';
import { formatDate } from '@/shared/utils/formatDate';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { router } from 'expo-router';
import { useNavigationLock } from '@/shared/hooks/ui/useNavigationLock';
import type { LoanStatus } from '../types/loans';

type Props = {
  loanApplicationId: string;
  amount: number;
  date: string;
  status: LoanStatus;
  loanType: string;
  showAction: boolean;
  provider: string;
  accountNumber: string;
  accountName: string;
};

const statusColors: Record<LoanStatus, string> = {
  Pending: '#F59E0B',
  Rejected: '#EF4444',
  'For Approval': '#10B981',
  Approved: '#3B82F6',
  Cancelled: '#F59E0B',
};

const LoanListCard = ({
  loanApplicationId,
  amount,
  date,
  status,
  loanType,
  showAction,
  provider,
  accountNumber,
  accountName,
}: Props) => {
  const cardColor = useThemeColor({}, 'card');
  const safeNavigate = useNavigationLock();
  const openFb = useCallback(async () => {
    const username = 'jeyvee.alibuyog';

    const appUrl = `fb://profile/${username}`; // try app
    const webUrl = `https://www.facebook.com/${username}`; // fallback

    try {
      const supported = await Linking.canOpenURL(appUrl);

      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.log('Error opening Facebook:', error);
      await Linking.openURL(webUrl);
    }
  }, []);
  return (
    <ThemedView style={[styles.card, { backgroundColor: cardColor }]}>
      {/* HEADER */}
      <View style={styles.rowBetween}>
        <ThemedText type="defaultSemiBold">{formatCurrency(amount)}</ThemedText>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[status] },
          ]}
        >
          <ThemedText style={styles.statusText}>{status}</ThemedText>
        </View>
      </View>

      {/* DETAILS */}
      <View style={styles.details}>
        <ThemedText type="description">Loan type: {loanType}</ThemedText>

        <ThemedText type="description">Provider: {provider}</ThemedText>
        <ThemedText type="description">Account Name: {accountName}</ThemedText>
        <ThemedText type="description">
          Account Number: {accountNumber}
        </ThemedText>
        <ThemedText type="description">Date: {formatDate(date)}</ThemedText>
      </View>

      {/* ACTION */}
      {showAction && (
        <>
          <ThemedText type="caption">
            Redirecting to Admin Messenger to continue your loan approval (C.I).
          </ThemedText>

          <AnimatedButton label="Redirect" onPress={openFb} />
        </>
      )}
      {status === 'Approved' && (
        <>
          <ThemedText type="caption">
            Continue to view the details of your loan application and sign to
            claim.
          </ThemedText>
          <AnimatedButton
            label="Continue"
            onPress={() =>
              safeNavigate(() =>
                router.push({
                  pathname: '/loans/loan-contract',
                  params: { loanApplicationId: loanApplicationId },
                }),
              )
            }
          />
        </>
      )}
    </ThemedView>
  );
};

export default LoanListCard;

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  details: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
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
