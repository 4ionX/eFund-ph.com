import { Colors, IconSize, Spacing } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../../../shared/components/theme/ThemedText';
import { useNavigationLock } from '@/shared/hooks/ui/useNavigationLock';

type TDataList = {
  name: string;
  iconName: any;
  href: string;
};

type TList = {
  title: string;
  data: TDataList[];
};

const AccountList = ({ title, data }: TList) => {
  const iconColor = useThemeColor({}, 'icon');
  const safeNavigate = useNavigationLock();

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>

      {data.map((item, i) => (
        <Pressable
          key={i}
          onPress={() => safeNavigate(() => router.push(item.href as any))}
          style={({ pressed }) => [
            styles.itemContainer,
            pressed && styles.itemPressed,
          ]}
        >
          <View style={styles.leftRow}>
            <Ionicons
              name={item.iconName}
              size={IconSize.md}
              color={iconColor}
            />
            <ThemedText type="default" style={styles.itemText}>
              {item.name}
            </ThemedText>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={IconSize.sm}
            color={iconColor}
          />
        </Pressable>
      ))}
    </View>
  );
};

export default AccountList;

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
    width: '100%',
    paddingHorizontal: Spacing.xs,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.semantic.disabled,
  },
  itemPressed: {
    backgroundColor: Colors.brand.secondary,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemText: {
    marginLeft: Spacing.xs,
  },
});
