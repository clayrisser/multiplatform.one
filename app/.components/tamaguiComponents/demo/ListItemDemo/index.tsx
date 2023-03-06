import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons';
import React from 'react';
import { ListItem, Separator, XStack, YGroup } from 'tamagui';

export function ListItemDemo() {
  return (
    <XStack $sm={{ flexDirection: 'column' }} paddingHorizontal="$4" space>
      <ListItemDemo1 />
      <ListItemDemo2 />
    </XStack>
  );
}

function ListItemDemo1() {
  return (
    <YGroup alignSelf="center" bordered width={240} size="$4">
      <ListItem hoverTheme icon={Star} title="Star" subTitle="Twinkles" />
      <ListItem hoverTheme icon={Moon}>
        Moon
      </ListItem>
      <ListItem hoverTheme icon={Sun}>
        Sun
      </ListItem>
      <ListItem hoverTheme icon={Cloud}>
        Cloud
      </ListItem>
    </YGroup>
  );
}

function ListItemDemo2() {
  return (
    <YGroup alignSelf="center" bordered width={240} size="$5" separator={<Separator />}>
      <ListItem hoverTheme pressTheme title="Star" subTitle="Subtitle" icon={Star} iconAfter={ChevronRight} />
      <ListItem hoverTheme pressTheme title="Moon" subTitle="Subtitle" icon={Moon} iconAfter={ChevronRight} />
    </YGroup>
  );
}
