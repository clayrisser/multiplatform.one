import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Text } from 'react-native';
import type { ProviderProps } from '../types';

export type StateProviderProps = ProviderProps & { disable?: boolean };

export function StateProvider({ children, ...props }: StateProviderProps) {
  if (props.disable) return <>{children}</>;
  return (
    <RecoilRoot>
      <Suspense fallback={<Text>loading . . .</Text>}>{children}</Suspense>
    </RecoilRoot>
  );
}
