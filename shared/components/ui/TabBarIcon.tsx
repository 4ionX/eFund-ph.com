import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import React, { type ComponentProps } from 'react';
import Animated from 'react-native-reanimated';

import useTabAnimation from '@/shared/hooks/ui/useTabAnimation';

type TabBarIconProps = IconProps<ComponentProps<typeof Ionicons>['name']> & {
  focused: boolean;
};

export function TabBarIcon({ style, focused, ...rest }: TabBarIconProps) {
  const tabAnimationHook = useTabAnimation({ focused });

  return (
    <Animated.View style={[tabAnimationHook.animatedStyle]}>
      <Ionicons size={24} style={[{ marginBottom: -3 }, style]} {...rest} />
    </Animated.View>
  );
}
