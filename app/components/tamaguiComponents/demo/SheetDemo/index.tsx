import React from 'react';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Sheet } from '@tamagui/sheet';
import type { SheetProps } from '@tamagui/sheet/types/types';
import { useState } from 'react';
import { Button, H1, H2, Paragraph, XStack } from 'tamagui';

export const SheetDemo = () => {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
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
        snapPoints={[85, 50, 25]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame f={1} p="$4" jc="center" ai="center" space="$5">
          <Button size="$6" circular icon={ChevronDown} onPress={() => setOpen(false)} />

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
      <Sheet.Frame f={1} jc="center" ai="center" space="$5">
        <Sheet.ScrollView p="$4" space>
          <Button size="$8" circular als="center" icon={ChevronDown} onPress={() => props.onOpenChange?.(false)} />
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
