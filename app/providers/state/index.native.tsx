import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Text } from 'react-native';
import ReactNativeRecoilPersist, { ReactNativeRecoilPersistGate } from 'react-native-recoil-persist';
import type { ProviderProps } from '../types';

export type StateProviderProps = ProviderProps;

export function StateProvider({ children }: StateProviderProps) {
  return (
    <RecoilRoot>
      <ReactNativeRecoilPersistGate store={ReactNativeRecoilPersist}>
        <Suspense fallback={<Text>loading . . .</Text>}>{children}</Suspense>
      </ReactNativeRecoilPersistGate>
    </RecoilRoot>
  );
}
