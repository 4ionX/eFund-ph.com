import { Ionicons } from '@expo/vector-icons';

import AccountList from '@/features/account/components/AccountList';
import {
  AccountSettings,
  GeneralSettings,
} from '@/features/account/constants/settings';
import { ThemedSafeAreaView } from '@/shared/components/theme/ThemedSafeAreaView';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import { IconSize, Radius, Spacing } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';

import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AccountHeader from '@/features/account/components/AccountHeader';
import { useLogout } from '@/features/account/hooks/useLogout';
import { useAuthStore } from '@/store/auth.store';

const AccountScreen = () => {
  const insets = useSafeAreaInsets();
  const iconColor = useThemeColor({}, 'icon');

  const { signOut } = useLogout();
  const user = useAuthStore((u) => u.user);
  const fullName = user?.user_metadata?.full_name || '';
  const email = user?.email || '';

  const photoURL =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '';

  // optional split name (kung gusto mo pa rin first/middle/last)
  const nameParts = fullName.split(' ');

  const firstName = nameParts[0] || '';
  const middleName = nameParts.length > 2 ? nameParts[1] : '';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  return (
    <ThemedSafeAreaView
      style={[
        styles.container,
        Platform.OS === 'android' && {
          paddingTop: insets.top + Spacing.lg,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AccountHeader
          photoURL={photoURL}
          firstName={firstName}
          middleName={middleName}
          lastName={lastName}
          phoneNumber={user?.phone}
          email={email}
        />

        {/* List */}
        <View style={styles.listContainer}>
          <ThemedView style={[styles.card, styles.elevated]}>
            <AccountList title="Account" data={AccountSettings} />
          </ThemedView>

          <ThemedView style={[styles.card, styles.elevated]}>
            <AccountList title="General" data={GeneralSettings} />
          </ThemedView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable onPress={signOut}>
            <View style={styles.logoutRow}>
              <Ionicons
                name="log-out-outline"
                size={IconSize.md}
                color={iconColor}
              />
              <ThemedText type="default" style={styles.logoutText}>
                Logout
              </ThemedText>
            </View>
          </Pressable>

          <ThemedText
            type="description"
            style={[styles.versionText, { color: iconColor }]}
          >
            Version 1.0.0
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },

  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  listContainer: {
    padding: Spacing.sm,
    gap: Spacing.md,
  },

  card: {
    borderRadius: Radius.md,
  },

  elevated: {
    width: '100%',
    padding: Spacing.md,
    borderRadius: Radius.md,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 12,

    elevation: 8,
  },

  footer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },

  logoutText: {
    marginLeft: Spacing.sm,
  },

  versionText: {
    marginBottom: Spacing.md,
  },
});
