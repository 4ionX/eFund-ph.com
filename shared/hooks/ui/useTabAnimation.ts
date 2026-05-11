import { useEffect } from 'react';
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

type TabProps = {
  focused: boolean;
};
const useTabAnimation = ({ focused }: TabProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      scale.value = withTiming(
        1,
        {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        },
        () => {
          scale.value = withTiming(1.2, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          });
        },
      );
    } else {
      // Ensure it's at scale 1 when not focused
      scale.value = withTiming(1, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [focused, scale]);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  return { scale, animatedStyle };
};

export default useTabAnimation;
