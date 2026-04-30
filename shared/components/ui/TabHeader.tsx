import { Colors, IconSize, Spacing } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import type { PropsWithChildren } from 'react';
// eslint-disable-next-line no-duplicate-imports
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { ThemedText } from '../theme/ThemedText';
import { ThemedView } from '../theme/ThemedView';

type Props = PropsWithChildren<{
  title: string;
  leftIconName?: 'chevron-back-outline' | 'close';
  rightIconName?: keyof typeof Ionicons.glyphMap | string;
  onBackPress?: () => void;
  onRightPress?: () => void;
}>;

const TabHeader = ({
  title,
  leftIconName,
  rightIconName,
  onBackPress,
  onRightPress,
  ...otherProps
}: Props) => {
  const colorScheme = useColorScheme() ?? 'light';
  const iconColor =
    colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]} {...otherProps}>
      <View style={styles.leftContainer}>
        {leftIconName && (
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons
              name={leftIconName}
              size={IconSize.md}
              color={iconColor}
            />
          </TouchableOpacity>
        )}

        {title && (
          <ThemedText type="title" style={styles.titleText}>
            {title}
          </ThemedText>
        )}
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={onRightPress}>
          {rightIconName ? (
            (Ionicons.glyphMap as Record<string, any>)[rightIconName] ? (
              <Ionicons
                name={rightIconName as keyof typeof Ionicons.glyphMap}
                size={IconSize.md}
                color={iconColor}
                style={{ paddingHorizontal: 6 }}
              />
            ) : (
              <ThemedText style={{ color: iconColor }}>Clear All</ThemedText>
            )
          ) : null}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: Spacing.sm,
  },
});

export default TabHeader;
