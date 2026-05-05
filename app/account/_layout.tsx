import { usePathname, router, Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useEffect, useMemo, useState } from 'react';

import { ThemedText } from '@/shared/components/theme/ThemedText';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';
import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import TabHeader from '@/shared/components/ui/TabHeader';
import CongratsModal from '@/features/account/components/CongratsModal';
import { isRegistrationComplete } from '@/shared/utils/checkRegistrationComplete';
import { useCoBorrowerStore } from '@/store/coBorrower.store';
import { useContactReferenceStore } from '@/store/contactReference.store';
import { useDocumentInformationStore } from '@/store/documents.store';
import { usePersonalInformationStore } from '@/store/personalInformation.store';
import { showAlert } from '@/shared/utils/ShowAlert';

const steps = [
  { path: 'personal-information', label: 'Personal Information' },
  { path: 'co-borrower', label: 'Co-Borrowers Information' },
  { path: 'contact-references', label: 'Contact References' },
  { path: 'documents', label: 'Documents' },
];

export default function RegistrationStepper() {
  const pathname = usePathname();

  const text = useThemeColor({}, 'text');
  const border = useThemeColor({}, 'border');

  const activeColor = '#3B82F6';
  const completedColor = '#10B981';

  const progress = useSharedValue(0);

  // 🔥 detect current step safely
  const currentIndex = useMemo(() => {
    const currentRoute = pathname.split('/').pop();
    return steps.findIndex((s) => s.path === currentRoute);
  }, [pathname]);

  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const currentStep = steps[safeIndex];

  // 🔥 animate progress bar
  useEffect(() => {
    progress.value = withTiming((safeIndex + 1) / steps.length);
  }, [progress, safeIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const { coBorrowerInfo } = useCoBorrowerStore();
  const { contactInfo } = useContactReferenceStore();
  const { documentsInfo } = useDocumentInformationStore();
  const { personalInfo } = usePersonalInformationStore();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const store = {
      personalInfo,
      coBorrowerInfo,
      contactInfo,
      documentsInfo,
    };

    if (isRegistrationComplete(store)) {
      setShowModal(true);
    }
  }, [personalInfo, coBorrowerInfo, contactInfo, documentsInfo]);

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      {/* 🔥 CUSTOM HEADER ONLY */}
      <TabHeader
        title={currentStep.label}
        leftIconName="chevron-back-outline"
        onBackPress={() => router.back()}
      />

      {/* 🔥 STEP INDICATOR */}
      <View style={styles.stepContainer}>
        {steps.map((step, index) => {
          const isActive = index === safeIndex;
          const isCompleted = index < safeIndex;

          return (
            <View key={step.path} style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: isCompleted
                      ? completedColor
                      : isActive
                        ? activeColor
                        : border,
                  },
                ]}
              />
              <ThemedText
                style={{
                  fontSize: 12,
                  color: text,
                  opacity: isActive || isCompleted ? 1 : 0.5,
                }}
              >
                {'Step ' + (index + 1)}
              </ThemedText>
            </View>
          );
        })}
      </View>

      {/* 🔥 PROGRESS BAR */}
      <View style={[styles.progressBar, { backgroundColor: border }]}>
        <Animated.View
          style={[
            styles.progress,
            { backgroundColor: activeColor },
            animatedStyle,
          ]}
        />
      </View>
      <CongratsModal
        visible={showModal}
        onSkip={() => {
          setShowModal(false);
        }}
        onProceed={() => {
          setShowModal(false);
          router.replace('/loans/loan-application');
        }}
      />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemedSafeAreaView>
  );
}
const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },

  stepItem: {
    alignItems: 'center',
  },

  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginBottom: 4,
  },

  progressBar: {
    height: 4,
    marginHorizontal: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },

  progress: {
    height: 4,
    borderRadius: 4,
  },
});
