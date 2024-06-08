/**
 * File: /src/tints.tsx
 * Project: @multiplatform.one/components
 * File Created: 22-04-2024 16:34:20
 * Author: Nate Wienert
 * Author: Clay Risser
 * Reference: https://github.com/tamagui/tamagui/blob/v1.94.5/packages/logo/src/tints.tsx
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

import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ThemeName, ThemeProps } from 'tamagui';
import { Theme } from 'tamagui';
import { useState, createContext, useContext, useMemo } from 'react';

export type TintFamily = string | number | symbol;

export interface TintFamilies {
  [family: TintFamily]: ThemeName[];
}

export interface TintFamiliesContextValue {
  families: TintFamilies;
  family: TintFamily;
  tintIndex: number;
  setFamily: Dispatch<SetStateAction<TintFamily>>;
  setTintIndex: (next: number) => void;
}

export interface Tint {
  families: TintFamilies;
  name: TintFamily;
  tints: ThemeName[];
}

const defaultTintFamiliesContextValue: TintFamiliesContextValue = {
  setFamily: () => {
    return;
  },
  setTintIndex: (_next: number) => {
    return;
  },
  family: 'tamagui',
  tintIndex: -3,
  families: {
    easter: ['yellow', 'pink', 'yellow', 'pink', 'yellow', 'pink', 'yellow'],
    halloween: ['orange', 'gray', 'orange', 'gray', 'orange', 'gray', 'orange'] as ThemeName[],
    lunar: ['yellow', 'red', 'red', 'red', 'red', 'red', 'yellow'],
    tamagui: ['orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'],
    valentine: ['pink', 'red', 'pink', 'red', 'pink', 'red', 'pink'],
    xmas: ['red', 'green', 'red', 'green', 'red', 'green', 'red'],
  },
};

const TintFamiliesContext = createContext<TintFamiliesContextValue>(defaultTintFamiliesContextValue);

export interface TintFamiliesProviderProps {
  children: React.ReactNode;
  defaultFamily?: TintFamily;
  defaultIndex?: number;
  families?: TintFamilies;
}

export function TintFamiliesProvider(props: TintFamiliesProviderProps) {
  const [family, setFamily] = useState<TintFamily>(props.defaultFamily || defaultTintFamiliesContextValue.family);
  const [tintIndex, setTintIndex] = useState<number>(props.defaultIndex || defaultTintFamiliesContextValue.tintIndex);
  const families = props.families || defaultTintFamiliesContextValue.families;
  const value = useMemo(
    () => ({
      families,
      family,
      tintIndex,
      setFamily,
      setTintIndex: (next: number) => {
        setTintIndex(next % (families[family]?.length || 0));
      },
    }),
    [family, setFamily, families, tintIndex, setTintIndex],
  );
  return <TintFamiliesContext.Provider value={value}>{props.children}</TintFamiliesContext.Provider>;
}

export function useTint(altOffset = -1) {
  const { families, family, setFamily, setTintIndex, tintIndex } = useContext(TintFamiliesContext);
  const tints = families[family];
  const tintAltIndex = Math.abs((tintIndex + altOffset) % (tints?.length || 0));
  const familiesNames = useMemo(() => Object.keys(families), [families]);
  return {
    families,
    familiesNames,
    name: family,
    tint: tints?.[tintIndex] as ThemeName,
    tintAlt: tints?.[tintAltIndex] as ThemeName,
    tintAltIndex,
    tintIndex,
    tints,
    setFamily,
    setTintIndex,
    setNextTint: () => {
      setTintIndex(tintIndex + 1);
    },
    setNextTintFamily: () => {
      setFamily(
        (prevFamily: TintFamily) =>
          familiesNames[(familiesNames.indexOf(prevFamily as string) + 1) % familiesNames.length] as TintFamily,
      );
    },
  } as const;
}

export interface ThemeTintProps extends ThemeProps {
  disable?: boolean;
}

export function ThemeTint({ disable, children, ...rest }: ThemeTintProps) {
  const curTint = useTint().tint;
  return (
    <Theme {...rest} name={disable ? null : curTint}>
      {children}
    </Theme>
  );
}

export interface ThemeTintAltProps extends ThemeProps {
  disable?: boolean;
  offset?: number;
}

export function ThemeTintAlt({ children, disable, offset = 1, ...rest }: ThemeTintAltProps) {
  const curTint = useTint(offset).tintAlt;
  const name = disable ? null : curTint;
  return (
    <Theme name={name} {...rest}>
      {children}
    </Theme>
  );
}
