/**
 * File: /layouts/Toast.tsx
 * Project: app
 * File: /layouts/Toast.tsx
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

import { useToastState, Toast as TamaguiToast, useToastController } from '@tamagui/toast';
import { useEffect } from 'react';
import { YStack } from 'tamagui';

export function Toast() {
  const toastState = useToastState();
  const toastController = useToastController();

  useEffect(() => {
    toastController.hide();
  }, []);

  return (
    toastState && (
      <TamaguiToast
        animation="bouncy"
        duration={toastState.duration}
        enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
        exitStyle={{ opacity: 0, scale: 1, y: -20 }}
        key={toastState.id}
        opacity={1}
        scale={1}
        viewportName={toastState.viewportName}
        y={0}
      >
        <YStack>
          <TamaguiToast.Title>{toastState.title}</TamaguiToast.Title>
          {!!toastState.message && <TamaguiToast.Description>{toastState.message}</TamaguiToast.Description>}
        </YStack>
      </TamaguiToast>
    )
  );
}
