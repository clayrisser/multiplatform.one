import React, { useState } from 'react';
import { SimplePopover } from './index';
import { Text, YStack, Button, XStack, Switch, Input, Label } from 'tamagui';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'panels/SimplePopover',
  component: SimplePopover,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <SimplePopover trigger={<Button>Click here to get a Popover</Button>}>
    <YStack>
      <Text>popover content</Text>
    </YStack>
  </SimplePopover>
);

function Open() {
  return (
    <SimplePopover
      trigger={<Button>hover on it to get Popover</Button>}
      triggerOnHover
      arrow={false}
      triggerStyle={{ als: 'center', ai: 'center' }}
    >
      <YStack>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <Text key={i}>{i}</Text>
        ))}
      </YStack>
    </SimplePopover>
  );
}

export const open = () => (
  <XStack jc="space-around">
    <Open />
    <Open />
  </XStack>
);

const OnCondition = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <YStack space>
      <Label>change the switch to get popover</Label>
      <Switch checked={props.open} onCheckedChange={setOpen} />
      <SimplePopover open={open} onOpenChange={setOpen} trigger={<Button>Popup will open here</Button>}>
        <Text>Conditional popover</Text>
      </SimplePopover>
    </YStack>
  );
};

export const onCondition = (args) => <OnCondition {...args} />;

const ConditionalPopover = () => {
  const [open, setOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');

  function handleInput(val) {
    if (val === 'show') setOpen(true);
    else setOpen(false);
    setInputVal(val);
  }

  return (
    <YStack space>
      <SimplePopover
        open={open}
        onOpenChange={setOpen}
        triggerElement={
          <YStack>
            <Input value={inputVal} onChangeText={handleInput} placeholder="type show to get popup" />
          </YStack>
        }
        arrow={true}
      >
        <Text>Conditional popover</Text>
      </SimplePopover>
    </YStack>
  );
};

export const conditionalPopover = (args) => <ConditionalPopover {...args} />;

export default meta;
