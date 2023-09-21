/**
 * File: /src/panels/SimpleSideSheet/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 20-09-2023 11:15:20
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2023
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

import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import type { SheetProps } from '@tamagui/sheet';
import { useState } from 'react';
import { Button, H1, H2, Input, Paragraph, XStack } from 'tamagui';
import React from 'react';
import { Stack, styled } from '@tamagui/core';
import { createSheet } from '@tamagui/sheet';

const Handle = styled(Stack, {
  variants: {
    open: {
      true: {
        opacity: 0.35,
      },
      false: {
        opacity: 0.5,
      },
    },
  } as const,
});

const Overlay = styled(Stack, {
  variants: {
    open: {
      true: {
        opacity: 1,
        pointerEvents: 'auto',
      },
      false: {
        opacity: 0,
        pointerEvents: 'none',
      },
    },
  } as const,
});

const Frame = styled(XStack, {
  backgroundColor: '$backgroundFocus',
});

export const Sheet = createSheet({
  Frame,
  Handle,
  Overlay,
});

export const SimpleSideSheet = () => {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(true);
  const [innerOpen, setInnerOpen] = useState(false);

  return (
    <>
      <XStack space>
        <Button onPress={() => setOpen(true)}>Open</Button>
        <Button onPress={() => setModal((x) => !x)}>{modal ? 'Type: Modal' : 'Type: Inline'}</Button>
      </XStack>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        // snapPoints={[85, 50, 25]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="bouncy"
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame flex={1} padding="$4" justifyContent="center" alignItems="center" space="$5">
          <Button size="$6" circular icon={ChevronDown} onPress={() => setOpen(false)} />
          <Input width={200} />
          {modal && (
            <>
              <InnerSheet open={innerOpen} onOpenChange={setInnerOpen} />
              <Button size="$6" circular icon={ChevronUp} onPress={() => setInnerOpen(true)} />
            </>
          )}
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

function InnerSheet(props: SheetProps) {
  return (
    <Sheet modal snapPoints={[90]} dismissOnSnapToBottom {...props}>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame flex={1} justifyContent="center" alignItems="center" space="$5">
        <Sheet.ScrollView padding="$4" space>
          <Button
            size="$8"
            circular
            alignSelf="center"
            icon={ChevronDown}
            onPress={() => props.onOpenChange?.(false)}
          />
          <H1>Hello world</H1>
          <H2>You can scroll me</H2>
          {[1, 2, 3].map((i) => (
            <Paragraph key={i} size="$10">
              Eu officia sunt ipsum nisi dolore labore est laborum laborum in esse ad pariatur. Dolor excepteur esse
              deserunt voluptate labore ea. Exercitation ipsum deserunt occaecat cupidatat consequat est adipisicing
              velit cupidatat ullamco veniam aliquip reprehenderit officia. Officia labore culpa ullamco velit. In sit
              occaecat velit ipsum fugiat esse aliqua dolor sint.
            </Paragraph>
          ))}
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
