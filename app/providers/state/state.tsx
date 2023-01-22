import React, { Suspense } from "react";
import { RecoilRoot } from "recoil";
import { Text } from "react-native";
import type { ProviderProps } from "../types";

export type StateProviderProps = ProviderProps;

export function StateProvider({ children }: StateProviderProps) {
  return (
    <RecoilRoot>
      <Suspense fallback={<Text>loading . . .</Text>}>{children}</Suspense>
    </RecoilRoot>
  );
}
