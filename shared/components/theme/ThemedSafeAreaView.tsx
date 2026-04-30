import { Platform } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
  type SafeAreaViewProps,
} from 'react-native-safe-area-context';

import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';

export type ThemedSafeAreaViewProps = SafeAreaViewProps;

export function ThemedSafeAreaView({
  style,
  children,
  ...otherProps
}: ThemedSafeAreaViewProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor,
          paddingTop: Platform.OS === 'android' ? insets.top || 24 : undefined,
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </SafeAreaView>
  );
}
