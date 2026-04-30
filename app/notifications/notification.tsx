import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import TabHeader from '@/shared/components/ui/TabHeader';
import { Colors, Spacing } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'Loan Approved',
    message: 'Your loan application has been approved.',
    time: '2 hours ago',
    icon: 'checkmark-circle',
  },
  {
    id: 2,
    type: 'info',
    title: 'Upload Documents',
    message: 'Please upload your missing documents.',
    time: '1 day ago',
    icon: 'document',
  },
  {
    id: 3,
    type: 'info',
    title: 'Loan For Approval',
    message: 'Your loan is currently under review.',
    time: '2 days ago',
    icon: 'time',
  },
  {
    id: 4,
    type: 'warning',
    title: 'Overdue Payment',
    message: 'Your payment is overdue.',
    time: '2 days ago',
    icon: 'alert-circle',
  },
];

const typeColors: Record<string, string> = {
  info: Colors.semantic.info,
  success: Colors.semantic.success,
  warning: Colors.semantic.warning,
};

const NotificationScreen = () => {
  const cardColor = useThemeColor({}, 'card');

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <TabHeader
        leftIconName="chevron-back-outline"
        title="Notifications"
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {notifications.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: cardColor }]}
          >
            <View style={styles.row}>
              <Ionicons
                name={item.icon as any}
                size={24}
                color={typeColors[item.type]}
              />
              <View style={styles.textContainer}>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText type="default">{item.message}</ThemedText>
                <ThemedText type="caption">{item.time}</ThemedText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  card: {
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContainer: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
});
