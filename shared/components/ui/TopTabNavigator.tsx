import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../theme/ThemedText';
import { ThemedView } from '../theme/ThemedView';
import { Colors } from '@/shared/constants/theme';

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
  const [textWidths, setTextWidths] = useState<Record<string, number>>({});

  return (
    <ThemedView style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {STATUS_TABS.map((item, index) => {
          const isActive = selectedTab === item;

          return (
            <TouchableOpacity
              key={String(item)}
              onPress={() => handleTabPress(item, index)}
              style={styles.tabItem}
            >
              <ThemedText
                onLayout={(e) => {
                  const { width } = e.nativeEvent.layout;
                  setTextWidths((prev) => ({ ...prev, [item]: width }));
                }}
                style={{
                  fontWeight: isActive ? '700' : '400',
                  color: isActive ? Colors.brand.primary : '#888',
                }}
              >
                {item}
              </ThemedText>

              <ThemedView
                style={{
                  height: 2,
                  marginTop: 6,
                  borderRadius: 2,
                  width: textWidths[item] || 20,
                  backgroundColor: isActive
                    ? Colors.brand.secondary
                    : 'transparent',
                }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
};

export default TopTabNavigator;
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 12,
  },
});
