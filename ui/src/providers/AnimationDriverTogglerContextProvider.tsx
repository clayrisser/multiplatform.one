import React, { PropsWithChildren } from 'react';
import type { AnimationDriver } from '@tamagui/web/types';
import { TamaguiInternalConfig } from 'tamagui';
import { createAnimations as createAnimationsCss } from '@tamagui/animations-css';
import { createContext, useMemo, useState } from 'react';

const ANIMATION_DRIVERS = ['css', 'react-native'] as const;

export const AnimationDriverTogglerContext = createContext<{
  driver: AnimationDriver;
  driverName: (typeof ANIMATION_DRIVERS)[number];
  nextDriver: () => void;
  setDriverName: (driverName: (typeof ANIMATION_DRIVERS)[number]) => void;
} | null>(null);

export interface AnimationDriverTogglerContextProviderProps extends PropsWithChildren {
  tamaguiConfig: TamaguiInternalConfig;
}

export const AnimationDriverTogglerContextProvider = ({
  children,
  tamaguiConfig,
}: AnimationDriverTogglerContextProviderProps) => {
  const [driverName, setDriverName] = useState<(typeof ANIMATION_DRIVERS)[number]>('react-native');

  const nextDriver = () => {
    setDriverName(ANIMATION_DRIVERS[(ANIMATION_DRIVERS.indexOf(driverName) + 1) % ANIMATION_DRIVERS.length]);
  };

  const driver = useMemo(() => {
    if (driverName === 'css')
      return createAnimationsCss({
        bouncy: 'ease-in 200ms',
        lazy: 'ease-in 600ms',
        slow: 'ease-in 500ms',
        quick: 'ease-in 100ms',
        tooltip: 'ease-in 400ms',
      });
    return tamaguiConfig.animations;
  }, [driverName]);

  return (
    <AnimationDriverTogglerContext.Provider value={{ driverName, nextDriver, setDriverName, driver }}>
      {children}
    </AnimationDriverTogglerContext.Provider>
  );
};
