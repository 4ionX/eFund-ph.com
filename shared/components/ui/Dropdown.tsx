import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

import { ThemedView } from "../theme/ThemedView";
import { useThemeColor } from "@/shared/hooks/theme/useThemeColor";
import { ThemedText } from "../theme/ThemedText";

type Props<T extends string> = {
  label: string;
  options: T[];
  value: T | "";
  onChange: (value: T) => void;
};

export default function Dropdown<T extends string>({
  label,
  options,
  value,
  onChange,
}: Props<T>) {
  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");

  return (
    <ThemedView style={{ marginBottom: 12 }}>
      {/* LABEL */}
      <ThemedText type="defaultSemiBold">{label}</ThemedText>

      {/* OPTIONS CONTAINER */}
      <View style={styles.container}>
        {options.map((item) => {
          const isSelected = value === item;

          return (
            <Pressable
              key={item}
              onPress={() => onChange(item)}
              style={[
                styles.item,
                {
                  backgroundColor: isSelected ? card : background,
                  borderColor: isSelected ? text : border,
                },
              ]}
            >
              <Text
                style={{
                  color: text,
                  fontWeight: isSelected ? "600" : "400",
                }}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
});
