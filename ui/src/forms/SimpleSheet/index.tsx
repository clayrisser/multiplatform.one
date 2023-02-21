import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Sheet } from '@tamagui/sheet';
import { SheetProps } from '@tamagui/sheet/types/types';
import { useState } from 'react';
import { Button, XStack } from 'tamagui';
import React from 'react';

type SimpleSheetProps = SheetProps & { element?: React.ReactNode } & { model: any };
type ComponentProps = SheetProps & { innerComponent?: React.ReactNode };

export const SimpleSheet = ({ children, element, model, ...props }: SimpleSheetProps) => {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);

  return (
    <>
      <XStack space>
        <Button onPress={() => setOpen(true)}>{children}</Button>
        <Button onPress={() => setModal((x) => !x)}>{modal ? 'Type: Modal' : 'Type: Inline'}</Button>
      </XStack>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal ? model : 'Inline'}
        open={open}
        onOpenChange={setOpen}
        snapPoints={[85, 50, 25]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        {...props}
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

function InnerSheet({ innerComponent, ...props }: ComponentProps) {
  return (
    <Sheet modal snapPoints={[90]} dismissOnSnapToBottom {...props}>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame f={1} jc="center" ai="center" space="$5">
        <Sheet.ScrollView p="$4" space>
          {innerComponent}
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
