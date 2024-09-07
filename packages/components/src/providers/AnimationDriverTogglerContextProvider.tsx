/**
 * File: /src/providers/AnimationDriverTogglerContextProvider.tsx
 * Project: @multiplatform.one/components
 * File Created: 04-04-2024 15:50:39
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createAnimations as createAnimationsCss } from "@tamagui/animations-css";
import type { AnimationDriver } from "@tamagui/web";
import React from "react";
import type { PropsWithChildren } from "react";
import { createContext, useMemo, useState } from "react";
import type { TamaguiInternalConfig } from "tamagui";

const ANIMATION_DRIVERS = ["css", "react-native"] as const;

export const AnimationDriverTogglerContext = createContext<{
  driver: AnimationDriver;
  driverName: (typeof ANIMATION_DRIVERS)[number];
  nextDriver: () => void;
  setDriverName: (driverName: (typeof ANIMATION_DRIVERS)[number]) => void;
} | null>(null);

export interface AnimationDriverTogglerContextProviderProps
  extends PropsWithChildren {
  tamaguiConfig: TamaguiInternalConfig;
}

export const AnimationDriverTogglerContextProvider = ({
  children,
  tamaguiConfig,
}: AnimationDriverTogglerContextProviderProps) => {
  const [driverName, setDriverName] =
    useState<(typeof ANIMATION_DRIVERS)[number]>("react-native");

  const nextDriver = () => {
    const nextIndex =
      (ANIMATION_DRIVERS.indexOf(driverName) + 1) % ANIMATION_DRIVERS.length;
    const nextDriverName = ANIMATION_DRIVERS[nextIndex];
    setDriverName(nextDriverName as (typeof ANIMATION_DRIVERS)[number]);
  };

  const driver = useMemo(() => {
    if (driverName === "css")
      return createAnimationsCss({
        bouncy: "ease-in 200ms",
        lazy: "ease-in 600ms",
        slow: "ease-in 500ms",
        quick: "ease-in 100ms",
        tooltip: "ease-in 400ms",
      });
    return tamaguiConfig.animations;
  }, [driverName]);

  return (
    <AnimationDriverTogglerContext.Provider
      value={{ driverName, nextDriver, setDriverName, driver }}
    >
      {children}
    </AnimationDriverTogglerContext.Provider>
  );
};
