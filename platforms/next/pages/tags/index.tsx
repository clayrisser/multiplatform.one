import { SimpleAlertDialog, SimpleDialog, SimplePopover, SimpleSheet } from '../../../../ui/src/forms';
export { getStaticProps } from 'multiplatform.one/next';
import { YStack, Button, XStack, Label, Input, Dialog, Popover, Text } from 'tamagui';

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
    <XStack space="$11" jc="center" ai="center">
      <SimpleAlertDialog
        title="Alert"
        description={<>Current Time is :: {new Date(Date.now()).toLocaleString()} </>}
        accept="Okay"
      >
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
      <SimpleSheet model="Inline">
        <Button>Sheet</Button>
      </SimpleSheet>
    </XStack>
  );
}
