import * as Haptics from "expo-haptics";
import { Platform, Pressable, StyleSheet, ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Radius, Spacing } from "@/shared/constants/theme";
import { useThemeColor } from "@/shared/hooks/theme/useThemeColor";
import { ThemedText } from "../theme/ThemedText";

type AnimatedCardProps = ViewProps & {
  title?: string;
  description?: string;
  subtitle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
};

export default function AnimatedCard({
  title,
  description,
  subtitle,
  onPress,
  children,
  style,
  ...rest
}: AnimatedCardProps) {
  const cardColor = useThemeColor({}, "card");

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (onPress) onPress();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[styles.container, style]}
      {...rest}
    >
      <Animated.View
        style={[styles.card, animatedStyle, { backgroundColor: cardColor }]}
      >
        {title && <ThemedText type="subtitle">{title}</ThemedText>}
        {subtitle && <ThemedText type="title">{subtitle}</ThemedText>}
        {description && (
          <ThemedText type="description">{description}</ThemedText>
        )}

        {/* Render any additional children */}
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: Spacing.md,
  },
  card: {
    width: "100%",
    padding: Spacing.md,
    borderRadius: Radius.md,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 6,
  },
});
