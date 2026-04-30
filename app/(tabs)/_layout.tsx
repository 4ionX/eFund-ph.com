import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform, StyleSheet, View } from 'react-native';

import { TabBarIcon } from '@/shared/components/ui/TabBarIcon';

export default function TabLayout() {
  const isIOS = Platform.OS === 'ios';

  if (isLiquidGlassAvailable()) {
    return (
      <View style={{ flex: 1 }}>
        <NativeTabs>
          {/* HOME */}
          <NativeTabs.Trigger name="index">
            <Icon sf="house" />
            <Label>Home</Label>
          </NativeTabs.Trigger>

          {/* BILLS */}
          <NativeTabs.Trigger name="bills">
            <Icon sf="doc.text" />
            <Label>Bills</Label>
          </NativeTabs.Trigger>

          {/* LOANS */}
          <NativeTabs.Trigger name="loans">
            <Icon sf="doc.text.magnifyingglass" />
            <Label>Loans</Label>
          </NativeTabs.Trigger>

          {/* ACCOUNT */}
          <NativeTabs.Trigger name="account">
            <Icon sf="person" />
            <Label>Account</Label>
          </NativeTabs.Trigger>
        </NativeTabs>
      </View>
    );
  }

  // ✅ FALLBACK (same as yours - already correct)
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: isIOS
          ? () => <BlurView intensity={50} style={styles.tabBarStyle} />
          : undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }: any) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="bills"
        options={{
          title: 'Bills',
          tabBarIcon: ({ color, focused }: any) => (
            <TabBarIcon
              name={focused ? 'receipt' : 'receipt-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="loans"
        options={{
          title: 'Loans',
          tabBarIcon: ({ color, focused }: any) => (
            <TabBarIcon
              name={focused ? 'document-text' : 'document-text-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }: any) => (
            <TabBarIcon
              name={focused ? 'person' : 'person-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
  },
  tabBarStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    zIndex: 1,
  },
});
