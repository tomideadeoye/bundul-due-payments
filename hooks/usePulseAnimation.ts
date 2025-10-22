import { useEffect } from 'react';
import { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

// Shared hook for pulse animations to improve performance and synchronization
export const usePulseAnimation = () => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.8, { 
        duration: 1500,
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    );
  }, []);

  return pulse;
};