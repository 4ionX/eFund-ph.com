import useSupport from '@/features/support/hooks/useSupport';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import { Colors, IconSize, Spacing } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

type Props = {
  item: any;
};

const SupportCard = memo(function SupportCard({ item }: Props) {
  const supportHook = useSupport();
  const cardBackgroundColor = useThemeColor({}, 'card');

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      style={[styles.card, { backgroundColor: cardBackgroundColor }]}
    >
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={item.iconName}
            size={IconSize.lg}
            color={Colors.brand.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText type="subtitle" style={styles.title}>
            {item.title}
          </ThemedText>
          <Pressable
            onPress={() => {
              if (item.id === 1) {
                supportHook.handleCall(item.label);
              } else {
                supportHook.openMessenger();
              }
            }}
          >
            <ThemedText type="default" style={styles.label}>
              {item.label}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
});

export default SupportCard;

const styles = StyleSheet.create({
  card: {
    margin: Spacing.md,
    height: 112, // approx h-28
    borderRadius: 12,
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 88,
  },
  iconContainer: {
    marginLeft: Spacing.sm,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    flex: 1,
  },
  title: {
    marginRight: Spacing.md,
  },
  label: {
    marginRight: Spacing.md,
    textDecorationLine: 'underline',
  },
});
