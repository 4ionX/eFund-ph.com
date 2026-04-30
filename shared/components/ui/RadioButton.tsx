import { Colors, Spacing, Typography } from "@/shared/constants/theme";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type RadioButtonProps = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
};

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  selected,
  onSelect,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const textColor =
    colorScheme === "dark" ? Colors.dark.text : Colors.light.text;
  const borderColor =
    colorScheme === "dark" ? Colors.dark.tint : Colors.light.tint;
  const fillColor = Colors.brand.primary;

  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={styles.radioContainer}
          onPress={() => onSelect(opt)}
          activeOpacity={0.7}
        >
          <View style={[styles.radioOuter, { borderColor }]}>
            {selected === opt && (
              <View
                style={[styles.radioInner, { backgroundColor: fillColor }]}
              />
            )}
          </View>
          <Text style={[styles.radioLabel, { color: textColor }]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Spacing.md,
    marginBottom: Spacing.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.xs,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.medium,
  },
});
