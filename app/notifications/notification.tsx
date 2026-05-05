import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { markAsRead } from '@/features/notifications/api/markAsRead';
import { useNotificationsQuery } from '@/features/notifications/hooks/useNotificationsQuery';
import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import TabHeader from '@/shared/components/ui/TabHeader';
import { Colors, Spacing } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const typeColors: Record<string, string> = {
  Info: Colors.semantic.info,
  Success: Colors.semantic.success,
  Warning: Colors.semantic.warning,
};

const NotificationScreen = () => {
  const cardColor = useThemeColor({}, 'card');
  const userId = useAuth()?.user?.id;

  const { data = [], refetch } = useNotificationsQuery(userId);

  const hasMarked = useRef(false);

  // ================================
  // AUTO MARK AS READ ON ENTER
  // ================================
  useEffect(() => {
    if (!data?.length) return;
    if (hasMarked.current) return;

    const unreadIds = data.filter((n: any) => !n.is_read).map((n: any) => n.id);

    if (unreadIds.length === 0) return;

    hasMarked.current = true;

    const markAll = async () => {
      try {
        await Promise.all(unreadIds.map((id: string) => markAsRead(id)));
        refetch();
      } catch (err) {
        console.log('Mark as read error:', err);
      }
    };

    markAll();
  }, [data, refetch]);

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <TabHeader
        leftIconName="chevron-back-outline"
        title="Notifications"
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {data.length === 0 ? (
          <ThemedText>No notifications yet</ThemedText>
        ) : (
          data.map((item: any) => (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: cardColor,
                  opacity: item.is_read ? 0.6 : 1,
                },
              ]}
            >
              <View style={styles.row}>
                <Ionicons
                  name={
                    item.type === 'Success'
                      ? 'checkmark-circle'
                      : item.type === 'Warning'
                        ? 'alert-circle'
                        : 'information-circle'
                  }
                  size={24}
                  color={typeColors[item.type] || Colors.semantic.info}
                />

                <View style={styles.textContainer}>
                  <ThemedText type="defaultSemiBold">{item.title}</ThemedText>

                  <ThemedText type="default">{item.message}</ThemedText>

                  <ThemedText type="caption">
                    {new Date(item.created_at).toLocaleString()}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))
        )}
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
