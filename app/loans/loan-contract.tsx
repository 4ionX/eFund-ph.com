import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Alert,
  ScrollView,
  useColorScheme,
  View,
} from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import ViewShot from 'react-native-view-shot';

import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';
import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import TabHeader from '@/shared/components/ui/TabHeader';
import { router, useLocalSearchParams } from 'expo-router';

import LoadingOverlay from '@/shared/components/ui/LoadingOverlay';
import { useAuthStore } from '@/store/auth.store';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { amountToWords } from '@/shared/utils/amountToWords';
import { formatDate } from '@/shared/utils/formatDate';
import { getDayOfWeek } from '@/shared/utils/getDayOfWeek';
import EFImage from '@/shared/components/ui/EFImage';

import { useFetchLoanContract } from '@/features/loans/hooks/useFetchContract';
import { useLoanContractForm } from '@/features/loans/hooks/useLoanContractForm';
import { useFileUpload } from '@/features/loans/hooks/useFileUpload';

const LoanContractScreen = () => {
  const { loanApplicationId } = useLocalSearchParams<{
    loanApplicationId: string;
  }>();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;
  const { data: loan, isLoading } = useFetchLoanContract(
    userId,
    loanApplicationId,
  );

  const ref = useRef<any>(null);
  const viewRef = useRef<any>(null);

  const [signature, setSignature] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const borderColor = isDark ? '#555' : '#000';
  const cardBg = isDark ? '#1C1C1E' : '#fff';

  const handleClear = () => {
    ref.current?.clearSignature();
    setSignature(null);
  };

  const { handleSave: handleSubmit, isPending } = useLoanContractForm();

  const { getSignedUrl } = useFileUpload();
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  const personal = loan?.personalInfo;
  const coBorrower = loan?.coBorrowers;
  const contractInfo = loan?.contractInfo;

  const handleOK = (sig: string) => {
    if (!sig) {
      Alert.alert('Error', 'Please provide a signature');
      return;
    }

    setSignature(sig);
    handleSubmit(sig, contractInfo?.id);
  };

  // ✅ ALWAYS define hooks first
  useEffect(() => {
    let mounted = true;

    const loadSignature = async () => {
      if (!loan?.contractInfo?.signatureUrl) return;

      try {
        const url = await getSignedUrl(loan.contractInfo.signatureUrl);

        if (mounted) {
          setSignatureUrl(url);
        }
      } catch (err) {
        console.log('Failed to load signature', err);
      }
    };

    loadSignature();

    return () => {
      mounted = false;
    };
  }, [getSignedUrl, loan?.contractInfo.signatureUrl]);

  // ❗ saka ka mag early return
  if (isLoading || !loan) {
    return <LoadingOverlay />;
  }

  const handleSave = () => {
    ref.current?.readSignature();
  };

  const fullName = [
    personal?.firstName,
    personal?.middleName,
    personal?.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  const coBorrowerFullName = [
    coBorrower?.firstName,
    coBorrower?.middleName,
    coBorrower?.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  const getWatermarkColor = (status?: string) => {
    switch (status) {
      case 'For Release':
        return 'rgba(0, 102, 255, 0.15)'; // blue
      case 'Cancelled':
        return 'rgba(255, 0, 0, 0.15)'; // red
      case 'Released':
        return 'rgba(0, 102, 255, 0.15)'; // red
      default:
        return 'transparent';
    }
  };

  const status = contractInfo?.status;
  const watermarkText = contractInfo?.status?.toUpperCase();

  const watermarkLines =
    watermarkText === 'FOR RELEASE' ? ['FOR', 'RELEASE'] : [watermarkText];
  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <TabHeader
        title="Loan Contract"
        leftIconName="chevron-back-outline"
        onBackPress={() => router.back()}
      />

      <ScrollView scrollEnabled={scrollEnabled}>
        <ViewShot ref={viewRef} options={{ format: 'jpg', quality: 1 }}>
          <View style={{ position: 'relative' }}>
            {/* ✅ WATERMARK LAYER */}

            <ThemedView
              style={[
                styles.container,
                { borderColor, backgroundColor: cardBg },
              ]}
            >
              {/* HEADER */}
              <ThemedView style={styles.header}>
                <ThemedText style={styles.headerText}>
                  DISBURSEMENT VOUCHER
                </ThemedText>
              </ThemedView>

              {/* TOP */}
              <ThemedView style={styles.rowBetween}>
                <ThemedText type="default">Mode: GCASH</ThemedText>
                <ThemedText type="default">
                  Date: {loan.contractInfo?.createdAt?.slice(0, 10) ?? 'N/A'}
                </ThemedText>
              </ThemedView>

              {/* NAME */}
              <ThemedView style={[styles.nameBox, { borderColor }]}>
                <ThemedText type="defaultSemiBold">
                  {fullName.toUpperCase()}
                </ThemedText>
                <ThemedText type="description">(principal borrower)</ThemedText>
              </ThemedView>
              {watermarkText && status !== 'Draft' && (
                <View
                  key={status}
                  pointerEvents="none"
                  style={[
                    styles.watermarkContainer,
                    { transform: [{ rotate: '-35deg' }] },
                  ]}
                >
                  {watermarkLines.map((line, index) => (
                    <ThemedText
                      type="subtitle"
                      key={index}
                      style={[
                        styles.watermarkText,
                        { color: getWatermarkColor(status) },
                      ]}
                    >
                      {line}
                    </ThemedText>
                  ))}
                </View>
              )}
              {/* DETAILS */}
              <ThemedView style={styles.section}>
                <Row
                  label="Loan Amount"
                  value={formatCurrency(contractInfo?.approvedAmount)}
                />
                <Row
                  label="Interest"
                  value={formatCurrency(contractInfo?.interest)}
                />
                <Row
                  label="Processing Fee"
                  value={formatCurrency(contractInfo?.processingFee)}
                />
                <Row
                  label="Notarial Fee"
                  value={formatCurrency(contractInfo?.notarialFee)}
                />
                <Row
                  label="Others"
                  value={formatCurrency(contractInfo?.serviceFee)}
                />
                <Row
                  label="Total Deductions"
                  value={formatCurrency(contractInfo?.totalDeduction)}
                  red
                />
                <Row
                  label="NET PROCEEDS"
                  value={formatCurrency(contractInfo?.netProceeds)}
                  highlight
                />
                <ThemedView style={styles.footer}>
                  <ThemedText>
                    {amountToWords(contractInfo?.netProceeds)}
                  </ThemedText>
                  <View
                    style={{
                      marginVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {signatureUrl ? (
                      <EFImage
                        source={{ uri: signatureUrl }} // ✅ IMPORTANT
                        style={styles.signatureImage}
                        contentFit="contain"
                        transition={200}
                      />
                    ) : signature ? (
                      <EFImage
                        source={{ uri: signature }}
                        style={styles.signatureImage}
                        contentFit="contain"
                        transition={200}
                      />
                    ) : null}
                    <ThemedText type="defaultSemiBold">
                      {fullName.toUpperCase()}
                    </ThemedText>
                    <ThemedText type="description">Received By:</ThemedText>
                  </View>
                  <View
                    style={{
                      marginVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ThemedText type="defaultSemiBold">
                      MR. JOHN ROBERT PACURSA
                    </ThemedText>
                    <ThemedText type="description">Loan Agent:</ThemedText>
                  </View>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* SCHEDULE OF PAYMENTS */}
            <ThemedView style={[styles.scheduleContainer, { borderColor }]}>
              <ThemedView style={styles.header}>
                <ThemedText style={styles.headerText}>
                  SCHEDULE OF PAYMENTS
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.scheduleContent}>
                <Row label="Name" value={fullName.toUpperCase()} />
                <Row
                  label="Loan Amount"
                  value={formatCurrency(contractInfo?.approvedAmount)}
                />
                <Row
                  label="Number of Payment/s"
                  value={contractInfo?.numberOfPayments}
                />
                <Row
                  label={contractInfo?.repaymentFrequency + ' ' + 'Amount'}
                  value={formatCurrency(contractInfo?.amortizationAmount)}
                />
                {contractInfo?.dueDates?.map((date: string, index: number) => (
                  <Row
                    key={index}
                    label={`Payment ${index + 1}`}
                    value={`${formatDate(date)} (${getDayOfWeek(date)})`}
                  />
                ))}
              </ThemedView>
            </ThemedView>

            {/* TERMS */}
            <ThemedView style={styles.footer}>
              <ThemedText type="description">
                {`I promise to pay the ${contractInfo?.repaymentFrequency?.toLowerCase()} amount of my loan until fully paid.`}
                {` Failure to pay ${contractInfo?.repaymentFrequency?.toLowerCase()} due, all ${contractInfo?.repaymentFrequency?.toLowerCase()} dues immediately become due and demandable.`}
                I also allow eFund to call my attention in any forms of social
                media.
              </ThemedText>
              <ThemedText></ThemedText>
            </ThemedView>

            {/* SIGNATURE */}
            <ThemedView style={styles.customerSign}>
              {signatureUrl ? (
                <EFImage
                  source={{ uri: signatureUrl }} // ✅ IMPORTANT
                  style={styles.signatureImage}
                  contentFit="contain"
                  transition={200}
                />
              ) : signature ? (
                <EFImage
                  source={{ uri: signature }}
                  style={styles.signatureImage}
                  contentFit="contain"
                  transition={200}
                />
              ) : null}
              <ThemedView style={[styles.line, { borderColor }]} />
              <ThemedText type="defaultSemiBold">
                {fullName.toUpperCase()}
              </ThemedText>
              <ThemedText>Customer&apos;s Signature</ThemedText>
            </ThemedView>

            {/* CO-MAKER */}
            <ThemedView style={styles.footer}>
              <ThemedText type="description">
                I voluntarily sign as a co-maker and willing to help the maker
                to pay. In the absence of maker, I will be the one to continue
                his/her monetary obligation.
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.customerSign}>
              <ThemedText type="defaultSemiBold">
                {coBorrowerFullName.toUpperCase()}
              </ThemedText>
              <ThemedText type="description" style={{ marginBottom: 10 }}>
                Co-Maker
              </ThemedText>
            </ThemedView>
          </View>
        </ViewShot>
        {/* SIGN PAD */}
        {!contractInfo?.signatureUrl && (
          <>
            <ThemedText style={styles.signLabel}>Please sign below:</ThemedText>

            <ThemedView style={[styles.signatureContainer, { borderColor }]}>
              <SignatureScreen
                ref={ref}
                onOK={handleOK}
                webStyle={signaturePadStyle}
                autoClear={false}
                onBegin={() => setScrollEnabled(false)}
                onEnd={() => setScrollEnabled(true)}
              />
            </ThemedView>

            {/* ACTION */}
            <ThemedView style={styles.actions}>
              <AnimatedButton label="Clear" onPress={handleClear} />
            </ThemedView>

            <ThemedView style={styles.actions}>
              <AnimatedButton
                label={isPending ? 'Submitting...' : 'Submit Application'}
                onPress={handleSave}
                disabled={isPending}
              />
              <AnimatedButton
                label="Cancel Application"
                onPress={handleClear}
              />
            </ThemedView>
          </>
        )}
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

export default LoanContractScreen;

/* COMPONENT */
const Row = ({ label, value, red, highlight, highlightBg }: any) => (
  <ThemedView style={styles.rowBetween}>
    <ThemedText>{label}</ThemedText>
    <ThemedText
      style={[
        red && { color: 'red' },
        highlight && { backgroundColor: highlightBg, paddingHorizontal: 4 },
      ]}
    >
      {value}
    </ThemedText>
  </ThemedView>
);

/* STYLES */
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
  },

  header: {
    backgroundColor: '#1E3A8A',
    padding: 6,
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
  },

  nameBox: {
    borderWidth: 1,
    margin: 6,
    padding: 6,
    alignItems: 'center',
    borderRadius: 6,
  },

  section: {
    padding: 6,
  },

  words: {
    alignItems: 'center',
    marginVertical: 6,
  },

  footer: {
    padding: 10,
    alignItems: 'center',
  },

  scheduleContainer: {
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
  },

  scheduleContent: {
    padding: 8,
  },

  customerSign: {
    alignItems: 'center',
    padding: 10,
  },

  line: {
    borderBottomWidth: 1,
    width: '80%',
    marginVertical: 6,
  },

  signatureImage: {
    width: 200,
    height: 70,
    resizeMode: 'contain',
    marginBottom: -10,
  },

  signatureContainer: {
    height: 200,
    borderWidth: 1,
    margin: 16,
    borderRadius: 8,
  },

  signLabel: {
    marginLeft: 16,
    marginTop: 10,
  },

  actions: {
    marginHorizontal: 16,
    marginBottom: 20,
  },

  bold: {
    fontWeight: 'bold',
  },
  watermarkContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 999,
  },

  watermarkText: {
    fontSize: 25,
    fontWeight: '900',

    letterSpacing: 20,
  },
});

const signaturePadStyle = `
  .m-signature-pad--footer {display: none;}
`;
