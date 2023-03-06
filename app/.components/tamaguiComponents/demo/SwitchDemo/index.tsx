import React from 'react';
import type { SizeTokens } from 'tamagui';
import { Label, Separator, Switch, XStack, YStack, styled } from 'tamagui';

export function SwitchDemo() {
  return (
    <YStack width={200} alignItems="center" space="$3">
      <SwitchWithLabel size="$2" />
      <SwitchWithLabel size="$3" />
      <SwitchWithLabel size="$4" />
      <SwitchWithLabel size="$5" />
    </YStack>
  );
}

function SwitchWithLabel(props: { size: SizeTokens }) {
  const id = `switch-${props.size.toString().slice(1)}`;
  return (
    <XStack width={200} alignItems="center" space="$4">
      <Label paddingRight="$0" minWidth={90} justifyContent="flex-end" size={props.size} htmlFor={id}>
        Dark mode
      </Label>
      <Separator minHeight={20} vertical />
      <Switch id={id} size={props.size}>
        <Switch.Thumb animation="quick" />
      </Switch>
    </XStack>
  );
}
