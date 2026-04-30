import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import { Colors, IconSize, Spacing } from '@/shared/constants/theme';
import { Ionicons } from '@expo/vector-icons';

import {
  Alert,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

type StickyHeaderProps = {
  title: string;
  style?: ViewStyle;
  rightIcon?: keyof typeof Ionicons.glyphMap;
};

export default function StickyHeader({
  title,
  style,
  rightIcon,
}: StickyHeaderProps) {
  //TODO:  router.push("/notifications/notification")
  return (
    <ThemedView
      style={[styles.header, { borderBottomColor: Colors.light.border }, style]}
    >
      <View style={styles.row}>
        <ThemedText type="title">{title}</ThemedText>

        {rightIcon && (
          <Pressable
            onPress={() => Alert.alert('Coming soon...')}
            style={styles.iconButton}
          >
            <Ionicons
              name={rightIcon}
              size={IconSize.lg}
              color={Colors.light.icon}
            />
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
  },
});
