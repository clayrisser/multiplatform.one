import { Heart } from '@tamagui/lucide-icons';
import { Button, TooltipSimple } from 'tamagui';
import React from 'react';
import { NextLink } from '../NextLink';

export const SponsorButton = (props: { tiny?: boolean }) => {
  const el = (
    <Button
      theme="red"
      icon={<Heart style={{ marginBottom: -1 }} size={props.tiny ? 8 : 10} color="var(--red10)" />}
      alignSelf="center"
      elevation="$3"
      borderWidth={props.tiny ? 0 : 1}
      borderColor="$borderColor"
      size={props.tiny ? '$2' : '$4'}
      fontFamily="$silkscreen"
      backgroundColor="$color1"
      borderRadius="$10"
      circular={props.tiny ? true : false}
      chromeless={props.tiny ? true : false}
    >
      {props.tiny ? '' : 'Sponsor'}
    </Button>
  );
  return (
    <NextLink target="_blank" href="https://github.com/sponsors/natew">
      {props.tiny ? <TooltipSimple label="Support OSS development of Tamagui">{el}</TooltipSimple> : el}
    </NextLink>
  );
};
