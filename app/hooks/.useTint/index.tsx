import React from 'react';
import { startTransition, useMemo, useSyncExternalStore } from 'react';
import type { ThemeName } from 'tamagui';
import { Theme } from 'tamagui';

import { getTints, setNextTintFamily, useTints } from '../../.components/tamaguiComponents/Logo';

// TODO useSyncExternalStore

// no localstorage because its not important to remember and causes a flicker
// const tintVal = typeof localStorage !== 'undefined' ? localStorage.getItem('tint') : 0
// const tint = tintVal ? +tintVal 0
export const initialTint = 3;

let current = initialTint;

const listeners = new Set<Function>();

export const onTintChange = (listener: (cur: number) => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const numTints = getTints().tints.length;

export const setTintIndex = (next: number) => {
  const val = next % numTints;
  if (val === current) return;
  current = val;
  startTransition(() => {
    listeners.forEach((x) => x(val));
  });
};

export const useTint = () => {
  const index = useSyncExternalStore(
    onTintChange,
    () => current,
    () => initialTint,
  );
  const tintsContext = useTints();
  const { tints } = tintsContext;

  return {
    ...tintsContext,
    tints: tintsContext.tints as ThemeName[],
    tintIndex: index,
    tint: tints[index] as ThemeName,
    setTintIndex,
    setNextTintFamily,
    setNextTint: () => {
      setTintIndex(index + 1);
    },
  } as const;
};

export const ThemeTint = (props: { children: any; disable?: boolean }) => {
  const curTint = useTint().tint;
  return (
    <Theme name={props.disable ? null : curTint}>
      {/*  */}
      {useMemo(() => props.children, [props.children])}
    </Theme>
  );
};
