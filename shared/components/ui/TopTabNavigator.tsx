import React, { useState } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
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
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const isFewTabs = STATUS_TABS.length <= 2;

  const [textWidths, setTextWidths] = useState<Record<string, number>>({});

  return (
    <ThemedView
      style={{
        flexDirection: 'row',
        justifyContent: isMobile ? 'flex-start' : 'center',
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          maxWidth: 600, // 🔥 important for desktop
          width: '100%',
          justifyContent: isFewTabs ? 'space-evenly' : 'flex-start',
        }}
      >
        {STATUS_TABS.map((item, index) => {
          const isActive = selectedTab === item;

          return (
            <TouchableOpacity
              key={String(item)}
              onPress={() => handleTabPress(item, index)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                marginHorizontal: isFewTabs ? 0 : 12,
              }}
            >
              <ThemedText
                onLayout={(e) => {
                  const { width } = e.nativeEvent.layout;
                  setTextWidths((prev) => ({
                    ...prev,
                    [item]: width,
                  }));
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
      </View>
    </ThemedView>
  );
};

export default TopTabNavigator;
