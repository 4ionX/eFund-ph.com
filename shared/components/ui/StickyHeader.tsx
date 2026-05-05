import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import { Colors, IconSize, Spacing } from '@/shared/constants/theme';
import { Ionicons } from '@expo/vector-icons';

import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { router } from 'expo-router';

type StickyHeaderProps = {
  title: string;
  style?: ViewStyle;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  badgeCount?: number;
};

export default function StickyHeader({
  title,
  style,
  rightIcon,
  badgeCount = 0,
}: StickyHeaderProps) {
  return (
    <ThemedView
      style={[styles.header, { borderBottomColor: Colors.light.border }, style]}
    >
      <View style={styles.row}>
        <ThemedText type="title">{title}</ThemedText>

        {rightIcon && (
          <Pressable
            onPress={() => router.push('/notifications/notification')}
            style={styles.iconButton}
          >
            <Ionicons
              name={rightIcon}
              size={IconSize.lg}
              color={Colors.light.icon}
            />

            {/* 🔥 BADGE */}
            {badgeCount > 0 && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>
                  {badgeCount > 9 ? '9+' : badgeCount}
                </ThemedText>
              </View>
            )}
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    zIndex: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 6,
    position: 'relative',
  },

  // 🔥 BADGE STYLE
  badge: {
    position: 'absolute',
    top: 1,
    right: 1,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
