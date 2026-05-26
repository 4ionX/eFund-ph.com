import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';
import { Radius, Spacing } from '@/shared/constants/theme';
import TabHeader from '@/shared/components/ui/TabHeader';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';
import { useAuthStore } from '@/store/auth.store';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { supabaseClient } from '@/core/api/supabaseClient';
import LoadingOverlay from '@/shared/components/ui/LoadingOverlay';
import { useFetchLoanTransactions } from '@/features/bills/hooks/useFetchLoanTransaction';
import { useMayaPayment } from '@/features/bills/hooks/useMayaPayment';

/* ================= TYPES ================= */

type Status = 'unpaid' | 'partial' | 'fully_settled' | 'principal_paid';

type LedgerUI = {
  id: string;
  reference_type: string;
  reference_number: string;
  remarks?: string;
  transaction_date: string;
  amount: number;
};

type ScheduleUI = {
  id: string;
  installmentNumber: number;
  dueDate: string;
  dueAmount: number;
  paid: number;
  penaltyPaid: number;
  penalty: number;
  balance: number;
  runningBalance: number;
  overdue: number;
  status: Status;
  ledger: LedgerUI[];
};

/* ================= STATUS MAP ================= */

const statusColor: Record<Status, string> = {
  unpaid: '#EF4444',
  partial: '#F59E0B',
  fully_settled: '#10B981',
  principal_paid: '#3B82F6',
};

const statusLabel: Record<Status, string> = {
  unpaid: 'Unpaid',
  partial: 'Partial',
  fully_settled: 'Fully Settled',
  principal_paid: 'Principal Paid',
};

const mapStatus = (status: string): Status => {
  const normalized = status?.toLowerCase().replace(/\s+/g, '_');

  switch (normalized) {
    case 'partial':
      return 'partial';
    case 'fully_settled':
    case 'paid':
      return 'fully_settled';
    case 'principal_paid':
      return 'principal_paid';
    default:
      return 'unpaid';
  }
};

/* ================= SCREEN ================= */

export default function PaymentScreen() {
  const { loanAccountId } = useLocalSearchParams();
  const { loading, initiatePayment } = useMayaPayment();

  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const mutedBg = useThemeColor({}, 'background');
  const textMuted = useThemeColor({}, 'text');

  const { data, isLoading, refetch } = useFetchLoanTransactions(
    loanAccountId as string,
  );

  useEffect(() => {
    if (!loanAccountId) return;

    const channel = supabaseClient
      .channel(`loan-updates-${loanAccountId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loan_repayment_schedules',
          filter: `loan_account_id=eq.${loanAccountId}`,
        },
        (payload) => {
          console.log('repayment update:', payload);
          refetch();
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loan_ledgers',
          filter: `loan_account_id=eq.${loanAccountId}`,
        },
        (payload) => {
          console.log('ledger update:', payload);
          refetch();
        },
      )
      .subscribe((status) => {
        console.log('realtime status:', status);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [loanAccountId, refetch]);

  const colorScheme = useColorScheme();
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleUI | null>(
    null,
  );
  const [amount, setAmount] = useState('');
  const [payMode, setPayMode] = useState('Principal Payment');

  /* ================= TRANSFORM ================= */

  const schedules: ScheduleUI[] = useMemo(() => {
    return (data?.data ?? []).map((item: any): ScheduleUI => {
      const status = mapStatus(item.payment_status);

      return {
        id: item.id,
        installmentNumber: item.installment_number,
        dueDate: item.due_date,
        dueAmount: item.due_amount,
        paid: item.amount_paid,
        penaltyPaid: item.penalty_amount_paid,
        penalty: item.penalty_amount,
        balance: item.due_amount - item.amount_paid,
        runningBalance: item.running_balance,
        overdue: item.overdue_amount,
        status,
        ledger:
          item.loan_ledgers?.map((l: any) => ({
            id: l.id,
            reference_type: l.reference_type,
            reference_number: l.reference_number,
            remarks: l.remarks,
            transaction_date: l.transaction_date,
            amount: l.amount_paid,
          })) ?? [],
      };
    });
  }, [data]);

  /* ================= HANDLERS ================= */

  const userId = useAuthStore((s) => s.user.id);

  useEffect(() => {
    if (!selectedSchedule) {
      setAmount('');
      setPayMode('Principal Payment');
    }
  }, [selectedSchedule]);

  const handlePay = async () => {
    if (!selectedSchedule) return;

    const enteredAmount = Number(amount);

    const maxAllowed =
      payMode === 'Penalty Payment'
        ? selectedSchedule.penalty
        : selectedSchedule.balance;

    if (enteredAmount > maxAllowed) {
      alert(`Max: ${formatCurrency(maxAllowed)}`);
      return;
    }

    if (enteredAmount <= 0 || isNaN(enteredAmount)) {
      alert('Enter valid amount');
      return;
    }

    // 🔥 CLOSE MODAL FIRST (important UX fix)
    setSelectedSchedule(null);
    setAmount('');

    // optional: small delay para smooth UX + avoids Safari timing issues
    setTimeout(() => {
      initiatePayment(
        loanAccountId as string,
        enteredAmount,
        userId,
        selectedSchedule.id,
        payMode,
        payMode === 'Penalty Payment'
          ? 'ONLINE PAYMENT(PENALTY)'
          : 'ONLINE PAYMENT',
      );
    }, 200);
  };
  const closeModal = () => {
    Keyboard.dismiss();
    setSelectedSchedule(null);
  };

  if (isLoading || loading) {
    return <LoadingOverlay />;
  }

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <TabHeader
        title="Repayment Schedule"
        leftIconName="chevron-back-outline"
        onBackPress={() => router.back()}
      />

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <ThemedView
            style={[styles.card, { backgroundColor: cardColor, borderColor }]}
          >
            {/* HEADER */}
            <View style={styles.rowBetween}>
              <View>
                <ThemedText style={{ fontSize: 11, color: textMuted }}>
                  Installment #{item.installmentNumber}
                </ThemedText>
                <ThemedText type="defaultSemiBold">
                  Due {item.dueDate}
                </ThemedText>
              </View>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: statusColor[item.status] },
                ]}
              >
                <ThemedText style={styles.badgeText}>
                  {statusLabel[item.status]}
                </ThemedText>
              </View>
            </View>

            {/* AMOUNTS */}
            <ThemedText>Due: {formatCurrency(item.dueAmount)}</ThemedText>
            <ThemedText>Paid: {formatCurrency(item.paid)}</ThemedText>
            <ThemedText>Balance: {formatCurrency(item.balance)}</ThemedText>

            {item.penalty > 0 && (
              <ThemedText style={{ color: '#EF4444' }}>
                Penalty: {formatCurrency(item.penalty)}
              </ThemedText>
            )}

            {item.overdue > 0 && (
              <ThemedText style={{ color: '#EF4444' }}>
                Overdue: {formatCurrency(item.overdue)}
              </ThemedText>
            )}

            {/* RUNNING BALANCE */}
            <View
              style={[
                styles.runningBox,
                { backgroundColor: mutedBg, borderColor },
              ]}
            >
              <ThemedText style={{ color: textMuted }}>
                Remaining Balance
              </ThemedText>
              <ThemedText type="defaultSemiBold">
                {formatCurrency(item.runningBalance)}
              </ThemedText>
            </View>

            {/* LEDGER */}
            <View style={styles.ledgerBox}>
              <ThemedText type="defaultSemiBold" style={styles.ledgerTitle}>
                Transactions
              </ThemedText>

              {item.ledger.length > 0 ? (
                item.ledger.map((l, index) => {
                  const isCredit =
                    l.reference_type === 'Principal Payment' ||
                    l.reference_type === 'Penalty Payment';

                  const color = isCredit ? '#10B981' : '#EF4444';

                  return (
                    <View key={l.id} style={styles.ledgerRow}>
                      <View style={styles.timeline}>
                        <View
                          style={[styles.dot, { backgroundColor: color }]}
                        />
                        {index !== item.ledger.length - 1 && (
                          <View style={styles.line} />
                        )}
                      </View>

                      <View
                        style={[
                          styles.ledgerCard,
                          { backgroundColor: mutedBg, borderColor },
                        ]}
                      >
                        <View style={styles.rowBetween}>
                          <ThemedText type="defaultSemiBold">
                            {l.reference_type}
                          </ThemedText>

                          <ThemedText style={[styles.amount, { color }]}>
                            {isCredit ? '+' : '-'}
                            {formatCurrency(l.amount)}
                          </ThemedText>
                        </View>

                        <ThemedText style={styles.ref}>
                          {l.reference_number}
                        </ThemedText>

                        {l.remarks && (
                          <ThemedText style={styles.remarks}>
                            {l.remarks}
                          </ThemedText>
                        )}

                        <ThemedText style={styles.date}>
                          {new Date(l.transaction_date).toLocaleString()}
                        </ThemedText>
                      </View>
                    </View>
                  );
                })
              ) : (
                <ThemedText style={{ color: textMuted }}>
                  No transactions yet
                </ThemedText>
              )}
            </View>

            {/* BUTTONS */}
            <View style={{ gap: 8 }}>
              {item.balance > 0 && (
                <AnimatedButton
                  label="Pay Balance"
                  onPress={() => {
                    setSelectedSchedule(item);
                    setPayMode('Principal Payment');
                  }}
                />
              )}

              {item.penalty > 0 && (
                <AnimatedButton
                  label="Pay Penalty"
                  onPress={() => {
                    setSelectedSchedule(item);
                    setPayMode('Penalty Payment');
                  }}
                />
              )}
            </View>
          </ThemedView>
        )}
      />

      {/* MODAL */}
      <Modal visible={!!selectedSchedule} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <ThemedText type="defaultSemiBold" style={{ color: 'black' }}>
                  Pay{' '}
                  {payMode === 'Penalty Payment' ? 'Penalty' : 'Installment'}
                </ThemedText>

                <ThemedText style={{ color: 'black' }}>
                  Amount:{' '}
                  {formatCurrency(
                    payMode === 'Penalty Payment'
                      ? selectedSchedule?.penalty
                      : selectedSchedule?.balance,
                  )}
                </ThemedText>

                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  placeholderTextColor={
                    colorScheme === 'dark' ? '#888' : '#bbb'
                  }
                  style={styles.input}
                  autoFocus
                />

                <View style={{ gap: 10 }}>
                  <AnimatedButton label="Pay Now" onPress={handlePay} />
                  <AnimatedButton label="Cancel" onPress={closeModal} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ThemedSafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 24,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  runningBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  ledgerBox: {
    marginTop: 12,
  },
  ledgerTitle: {
    marginBottom: 10,
    fontSize: 14,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timeline: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#ddd',
    marginTop: 2,
  },
  ledgerCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  ref: {
    fontSize: 10,
    opacity: 0.6,
  },
  remarks: {
    fontSize: 11,
  },
  date: {
    fontSize: 10,
    opacity: 0.5,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000080',
    padding: 20,
    paddingBottom: 120,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
});
