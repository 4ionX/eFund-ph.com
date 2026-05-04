import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import AboutCard from '@/features/home/components/AboutCard';
import ProcessCard from '@/features/home/components/ProcessCard';
import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';
import AnimatedCard from '@/shared/components/ui/HapticCard';
import StickyHeader from '@/shared/components/ui/StickyHeader';
import { Colors, IconSize, Radius, Spacing } from '@/shared/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Field } from '@/shared/components/ui/Field';

import { useAuthStore } from '@/store/auth.store';
import { useNavigationLock } from '@/shared/hooks/ui/useNavigationLock';
import { useFetchCoBorrowers } from '@/features/account/hooks/useFetchCoBorrower';
import { useFetchPersonalInformation } from '@/features/account/hooks/useFetchPersonalInformation';
import { useLoanNavigation } from '@/features/home/hooks/useLoanNavigation';
import { useFetchContactReference } from '@/features/account/hooks/useFetchContactReference';
import { useFetchDocuments } from '@/features/account/hooks/useFetchDocuments';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const {
    data: personalInfo,
    isLoading: personalInfoLoading,
    refetch: refetchPersonal,
  } = useFetchPersonalInformation(user?.id);

  const {
    data: coBorrowerInfo,
    isLoading: coBorrowerLoading,
    refetch: refetchCoBorrower,
  } = useFetchCoBorrowers(user?.id);

  const {
    data: contactReferenceInfo,
    isLoading: contactReferenceLoading,
    refetch: refetchContact,
  } = useFetchContactReference(user?.id);

  const {
    data: documentsInfo,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = useFetchDocuments(user?.id);
  const { handleApplyNow } = useLoanNavigation();
  const safeNavigate = useNavigationLock();

  const isCompleteRegistration =
    personalInfo && coBorrowerInfo && contactReferenceInfo && documentsInfo;

  useEffect(() => {
    if (!user?.id) return;

    const fetchAll = async () => {
      try {
        await Promise.all([
          refetchPersonal?.(),
          refetchCoBorrower?.(),
          refetchContact?.(),
          refetchDocuments?.(),
        ]);
      } catch (err) {
        console.log('Refetch error:', err);
      }
    };

    fetchAll();
  }, [
    refetchCoBorrower,
    refetchContact,
    refetchDocuments,
    refetchPersonal,
    user?.id,
  ]);

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        >
          <StickyHeader title="eFund" rightIcon="notifications-outline" />
          <Field>
            <AnimatedCard>
              <ThemedText type="defaultSemiBold">Loan Offer</ThemedText>
              <ThemedText type="caption">
                Apply now and get approved in minutes.
              </ThemedText>

              <View style={styles.offerBox}>
                <View style={styles.offerRow}>
                  <View style={styles.offerItem}>
                    <Ionicons
                      name="calculator-outline"
                      size={IconSize.lg}
                      color={Colors.brand.primary}
                    />
                    <ThemedText type="caption">Low interest rate</ThemedText>
                  </View>

                  <View style={styles.offerItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={IconSize.lg}
                      color={Colors.brand.primary}
                    />
                    <ThemedText type="caption">Flexible terms</ThemedText>
                  </View>

                  <View style={styles.offerItem}>
                    <Ionicons
                      name="time-outline"
                      size={IconSize.lg}
                      color={Colors.brand.primary}
                    />
                    <ThemedText type="caption">Within 1 day</ThemedText>
                  </View>
                </View>
              </View>

              <ThemedText type="caption" style={styles.caption}>
                Loan amount may increase for repeat borrowers with good payment
                history.
              </ThemedText>
              {personalInfoLoading ||
              coBorrowerLoading ||
              documentsLoading ||
              contactReferenceLoading ? (
                <ActivityIndicator
                  size={IconSize['3xl']}
                  color={Colors.brand.primary}
                  style={{ marginTop: Spacing.md }}
                />
              ) : (
                <AnimatedButton
                  label={
                    isCompleteRegistration
                      ? 'Apply Now'
                      : 'Complete Registration'
                  }
                  disabled={
                    contactReferenceLoading ||
                    documentsLoading ||
                    personalInfoLoading ||
                    coBorrowerLoading
                  }
                  onPress={() => handleApplyNow()}
                />
              )}
            </AnimatedCard>
          </Field>
          <Field>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle">Loan Process</ThemedText>
              <View style={styles.row}>
                <Pressable
                  onPress={() =>
                    safeNavigate(() => router.push('/guidelines/loan-steps'))
                  }
                >
                  <ThemedText style={styles.linkText} type="caption">
                    How to loan?
                  </ThemedText>
                </Pressable>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={Colors.brand.primary}
                  style={{ marginLeft: 4 }}
                />
              </View>
            </View>

            <ProcessCard />
          </Field>
          <Field>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle">About</ThemedText>
            </View>

            <AboutCard />
          </Field>
        </ScrollView>

        {/* Bottom Sheet Login */}
        {/* <DynamicBottomSheet
          visible={openSheet}
          setVisible={setOpenSheet}
          initialSnapHeight="80%"
          maxSnapHeight="80%"
          type="default"
        >
          <LoginForm setOpenSheet={setOpenSheet} />
        </DynamicBottomSheet> */}
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingVertical: Spacing.md,
    paddingBottom: Spacing['2xl'],
  },

  offerBox: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
    backgroundColor: Colors.brand.primary + '10',
  },

  offerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  offerItem: {
    alignItems: 'center',
  },

  caption: {
    marginTop: Spacing.sm,
  },

  sectionHeader: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  linkText: {
    color: Colors.brand.primary,
  },
});
