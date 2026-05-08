import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';

import { TabBarIcon } from '@/shared/components/ui/TabBarIcon';
import { useAuthStore } from '@/store/auth.store';
import { supabaseClient } from '@/core/api/supabaseClient';
import { useLogout } from '@/features/account/hooks/useLogout';
import { showAlert } from '@/shared/utils/ShowAlert';

export default function TabLayout() {
  const isIOS = Platform.OS === 'ios';

  const { user, setUser } = useAuthStore();
  const { performSignOut } = useLogout();

  // ==========================
  // BAN CHECK (SAFE VERSION)
  // ==========================
  useEffect(() => {
    if (!user?.id) return;

    const checkBan = async () => {
      try {
        // ✅ SAFE WAY: get session user (NOT admin API)
        const { data, error } = await supabaseClient.auth.getUser();

        if (error || !data?.user) {
          console.log('AUTH ERROR:', error?.message);
          return;
        }

        const currentUser = data.user;

        const isBanned = !!currentUser?.app_metadata?.is_banned;

        console.log('isBanned:', isBanned);

        if (isBanned) {
          console.log('🚨 USER BANNED → AUTO LOGOUT');

          await performSignOut();
          showAlert('Your account has been disabled.');
          setUser(null);
        } else {
          setUser(currentUser);
        }
      } catch (err: any) {
        console.log('FETCH USER ERROR:', err.message);
      }
    };

    checkBan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================
  // LIQUID GLASS NAV
  // ==========================
  if (isLiquidGlassAvailable()) {
    return (
      <View style={{ flex: 1 }}>
        <NativeTabs>
          <NativeTabs.Trigger name="index">
            <Icon sf="house" />
            <Label>Home</Label>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="bills">
            <Icon sf="doc.text" />
            <Label>Bills</Label>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="loans">
            <Icon sf="doc.text.magnifyingglass" />
            <Label>Loans</Label>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="account">
            <Icon sf="person" />
            <Label>Account</Label>
          </NativeTabs.Trigger>
        </NativeTabs>
      </View>
    );
  }

  // ==========================
  // FALLBACK TABS
  // ==========================
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
