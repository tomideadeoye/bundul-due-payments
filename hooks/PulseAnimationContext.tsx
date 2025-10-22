import React, { createContext } from 'react';
import { usePulseAnimation } from './usePulseAnimation';
import { SharedValue } from 'react-native-reanimated';

// Create context for sharing pulse animation across components
export const PulseAnimationContext = createContext<SharedValue<number> | null>(null);

type PulseAnimationProviderProps = {
  children: React.ReactNode;
};

export const PulseAnimationProvider: React.FC<PulseAnimationProviderProps> = ({ children }) => {
  const pulse = usePulseAnimation();
  
  return (
    <PulseAnimationContext.Provider value={pulse}>
      {children}
    </PulseAnimationContext.Provider>
  );
};