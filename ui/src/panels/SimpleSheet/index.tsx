import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Sheet } from '@tamagui/sheet';
import { SheetProps } from '@tamagui/sheet/types/types';
import { Button, SizeTokens, XStack, YStack } from 'tamagui';
import React from 'react';
import { create } from 'zustand';

type SimpleSheetProps = SheetProps & { sheetElement?: React.ReactNode } & { modal?: boolean } & {
  buttonSize?: SizeTokens | undefined;
};
type ComponentProps = SheetProps & { innerSheetElement?: React.ReactNode } & {
  innerSheetButtonSize?: SizeTokens | undefined;
};

interface State {
  position: number;
  open: boolean;
  innerOpen: boolean;
}
interface Action {
  setPosition: (position: number) => void;
  setOpen: (open: boolean) => void;
  setInnerOpen: (innerOpen: boolean) => void;
}

const useStore = create<State & Action>((set) => ({
  position: 0,
  open: false,
  innerOpen: false,
  setPosition: (position) => set({ position }),
  setOpen: (open) => set({ open }),
  setInnerOpen: (innerOpen) => set({ innerOpen }),
}));

export const SimpleSheet = ({
  children,
  sheetElement,
  modal,
  innerSheetElement,
  buttonSize,
  innerSheetButtonSize,
  ...props
}: SimpleSheetProps & ComponentProps) => {
  const { position, open, innerOpen, setPosition, setOpen, setInnerOpen } = useStore();
  return (
    <>
      <XStack space>
        <Button onPress={() => setOpen(true)}>{children}</Button>
      </XStack>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal || false}
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
        <Sheet.Frame>
          {sheetElement || (
            <YStack f={1} p="$4" space="$5" jc="center" ai="center">
              <Button size={buttonSize || '$6'} circular icon={ChevronDown} onPress={() => setOpen(false)} />
              {(modal || innerSheetElement) && (
                <>
                  <InnerSheet
                    open={innerOpen}
                    onOpenChange={setInnerOpen}
                    innerSheetElement={innerSheetElement}
                    innerSheetButtonSize={innerSheetButtonSize}
                    {...props}
                  />
                  <Button size={buttonSize || '$6'} circular icon={ChevronUp} onPress={() => setInnerOpen(true)} />
                </>
              )}
            </YStack>
          )}
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

function InnerSheet({ innerSheetElement, innerSheetButtonSize, ...props }: ComponentProps) {
  return (
    <Sheet modal snapPoints={[90]} dismissOnSnapToBottom {...props}>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame f={1} jc="center" ai="center" space="$5">
        <Sheet.ScrollView p="$4" space>
          <Button
            size={innerSheetButtonSize || '$8'}
            circular
            als="center"
            icon={ChevronDown}
            onPress={() => props.onOpenChange?.(false)}
          />
          {innerSheetElement}
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
