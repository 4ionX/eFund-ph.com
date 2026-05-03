import { Colors } from '@/shared/constants/theme';
import type { View } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const useTrippleAnimation = () => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(0);
  const aRef = useAnimatedRef<View>();
  const rippleOpacity = useSharedValue(0);

  const tapGesture = Gesture.Tap()
    .onStart((tapEvent) => {
      const layout = measure(aRef);
      if (layout) {
        centerX.value = tapEvent.x;
        centerY.value = tapEvent.y;
        rippleOpacity.value = 1;
        scale.value = 0;
        scale.value = withTiming(1, { duration: 500 });
      }
    })
    .onEnd(() => {
      rippleOpacity.value = withTiming(0, { duration: 500 });
    });

  const rStyle = useAnimatedStyle(() => {
    const layout = measure(aRef);
    if (!layout) return {};
    const diameter = Math.max(layout.width, layout.height) * 2;
    return {
      position: 'absolute',
      width: diameter,
      height: diameter,
      borderRadius: diameter / 2,
      backgroundColor: Colors.brand.primary,
      opacity: rippleOpacity.value,
      top: centerY.value - diameter / 2,
      left: centerX.value - diameter / 2,
      transform: [{ scale: scale.value }],
    };
  });

  return { rStyle, tapGesture, aRef };
};

export default useTrippleAnimation;
