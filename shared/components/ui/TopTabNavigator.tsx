import { Colors } from "@/shared/constants/theme";
import React, { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { ThemedText } from "../theme/ThemedText";
import { ThemedView } from "../theme/ThemedView";

interface Props<T extends string> {
  STATUS_TABS: readonly T[];
  selectedTab: T;
  handleTabPress: (tab: T, index: number) => void;
}

const TopTabNavigator = <T extends string>({
  STATUS_TABS,
  selectedTab,
  handleTabPress,
}: Props<T>) => {
  const { width } = useWindowDimensions();
  const isFewTabs = STATUS_TABS.length <= 2;

  // 🔥 store label widths
  const [textWidths, setTextWidths] = useState<Record<string, number>>({});

  return (
    <ThemedView>
      <FlatList
        horizontal
        data={STATUS_TABS}
        keyExtractor={(item) => String(item)}
        extraData={[selectedTab, textWidths]}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 10,
        }}
        renderItem={({ item, index }) => {
          const isActive = selectedTab === item;

          return (
            <TouchableOpacity
              onPress={() => handleTabPress(item, index)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
                width: isFewTabs ? width / STATUS_TABS.length : undefined,
                marginHorizontal: isFewTabs ? 0 : 10,
              }}
            >
              {/* TEXT (MEASURE WIDTH) */}
              <ThemedText
                onLayout={(e) => {
                  const { width } = e.nativeEvent.layout;
                  setTextWidths((prev) => ({
                    ...prev,
                    [item]: width,
                  }));
                }}
                style={{
                  fontWeight: isActive ? "700" : "400",
                  color: isActive ? Colors.brand.primary : "#888",
                }}
              >
                {item}
              </ThemedText>

              {/* INDICATOR (MATCH TEXT WIDTH) */}
              <ThemedView
                style={{
                  height: 2,
                  marginTop: 6,
                  borderRadius: 2,

                  width: textWidths[item] || 20, // fallback

                  backgroundColor: isActive
                    ? Colors.brand.secondary
                    : "transparent",
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </ThemedView>
  );
};

export default TopTabNavigator;