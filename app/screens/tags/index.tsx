import { SimpleAlertDialog, SimpleDialog, SimplePopover, SimpleSheet, SimpleTooltip } from '../../../ui/src/forms';
import { YStack, Button, XStack, Label, Input, Dialog, Popover, Text, Theme } from 'tamagui';

const DialogComponent = () => (
  <YStack>
    <Label>Name</Label>
    <Input defaultValue="Welcome to the dialog" />
    <Dialog.Close>
      <Button>Save Changes</Button>
    </Dialog.Close>
  </YStack>
);
export default function Tags() {
  return (
    <YStack jc="center" ai="center">
      <XStack space="$11" jc="center" ai="center">
        <SimpleAlertDialog title="Alert" description={<>Current Time is :: {new Date(Date.now()).toLocaleString()} </>}>
          <Button>Get Alert</Button>
        </SimpleAlertDialog>
        <SimpleDialog
          title="Registration Form"
          element={<DialogComponent />}
          description="make changes on the form and save the details"
        >
          <Button>get Dialogs</Button>
        </SimpleDialog>

        <SimplePopover
          element={
            <YStack>
              Give Some Information Here!
              <Text>Hello! User</Text>
              <Popover.Close>
                <Button>Close</Button>
              </Popover.Close>
            </YStack>
          }
        >
          <Button>Popover</Button>
        </SimplePopover>
        <SimpleTooltip element={<Text>Hello</Text>} placement="bottom">
          <Button>Tooltip</Button>
        </SimpleTooltip>
        <Theme name="pink">
          <Button>Theme</Button>
        </Theme>
      </XStack>
      <YStack w={500} height={200}>
        <SimpleSheet innerSheetElement={<YStack>hello How are You</YStack>} buttonSize="$3" innerSheetButtonSize="$4">
          <Button>Sheet</Button>
        </SimpleSheet>
      </YStack>
    </YStack>
  );
}
