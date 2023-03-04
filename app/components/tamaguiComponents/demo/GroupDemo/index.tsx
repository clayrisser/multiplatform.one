import React from 'react';
import { Activity, Airplay } from '@tamagui/lucide-icons';
import { Button, ListItem, Separator, XGroup, YGroup, YStack } from 'tamagui';

export function GroupDemo() {
  return (
    <YStack p="$3" space="$2" ai="center">
      <XGroup>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </XGroup>

      {/* responsive + size */}
      <XGroup size="$3" $gtSm={{ size: '$5' }}>
        <Button size="$3" icon={Activity}>
          First
        </Button>
        <Button size="$3" icon={Airplay}>
          Second
        </Button>
      </XGroup>

      <YGroup separator={<Separator />}>
        <ListItem title="First" />
        <ListItem title="Second" subTitle="Second subtitle" />
        <ListItem>Third</ListItem>
      </YGroup>
    </YStack>
  );
}
