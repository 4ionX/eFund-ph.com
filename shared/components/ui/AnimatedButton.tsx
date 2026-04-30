import { Pressable, StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { Colors, Radius } from "@/shared/constants/theme";
import { useThemeColor } from "@/shared/hooks/theme/useThemeColor";
import useTrippleAnimation from "@/shared/hooks/ui/useTrippleAnimation";
import { ThemedText } from "../theme/ThemedText";

type EButton = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

const AnimatedButton = ({ label, onPress, disabled }: EButton) => {
  const trippleAnimationHook = useTrippleAnimation();
  const backgroundColor = useThemeColor({}, "background");

  return (
    <GestureDetector gesture={trippleAnimationHook.tapGesture}>
      <Pressable
        onPress={() => onPress?.()}
        disabled={disabled}
        style={styles.pressable}
      >
        <View ref={trippleAnimationHook.aRef} collapsable={false}>
          {/* Container for button + ripple */}
          <View
            style={[
              styles.buttonContainer,
              {
                borderColor: Colors.brand.primary,
                backgroundColor: !disabled
                  ? backgroundColor
                  : Colors.semantic.disabled,
              },
            ]}
          >
            {/* Ripple */}
            <Animated.View style={trippleAnimationHook.rStyle} />

            {/* Button Label */}
            <ThemedText type="subtitle">{label}</ThemedText>
          </View>
        </View>
      </Pressable>
    </GestureDetector>
  );
};

export default AnimatedButton;

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    marginTop: 16,
  },
  buttonContainer: {
    height: 50,
    width: "100%",
    borderRadius: Radius.full,
    borderWidth: 1.5,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
});
