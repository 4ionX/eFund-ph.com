import { Support } from '@/features/account/constants/settings';
import SupportCard from '@/features/support/components/SupportCard';
import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import TabHeader from '@/shared/components/ui/TabHeader';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type SupportItem = {
  id: number;
  title: string;
  label: string;
  iconName: string;
};

type TList = {
  title: string;
  data: SupportItem[];
};

const SupportScreen = ({ data }: TList) => {
  data = Support;

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <TabHeader
        leftIconName="chevron-back-outline"
        title="Support"
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {data.map((item) => (
          <SupportCard key={item.id} item={item} />
        ))}
        <View style={{ paddingHorizontal: 16 }}>
          <ThemedText type="default">
            For inquiries regarding our services, please contact us through the
            provided channels.
          </ThemedText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/terms-and-conditions')}>
          <ThemedText type="subtitle" style={styles.linkText}>
            Terms of Use
          </ThemedText>
        </TouchableOpacity>
        <ThemedText type="default"> and </ThemedText>
        <TouchableOpacity onPress={() => router.push('/privacy-policy')}>
          <ThemedText type="subtitle" style={styles.linkText}>
            Privacy Policy
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedSafeAreaView>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});
