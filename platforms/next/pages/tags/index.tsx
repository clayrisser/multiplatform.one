import { SimpleAlertDialog, SimpleDialog } from '../../../../ui/src/forms';
export { getStaticProps } from 'multiplatform.one/next';
import { YStack, Button, XStack, Label, Input, Dialog } from 'tamagui';

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
    <XStack space jc="center" ai="center">
      <SimpleAlertDialog
        title="Alert"
        description={<>Current Time is :: {new Date(Date.now()).toLocaleString()} </>}
        accept="ok"
      >
        <Button>Get Alert</Button>
      </SimpleAlertDialog>

      <SimpleDialog
        title="Registration Form"
        element={<DialogComponent />}
        description="make changes on the form and save the details"
      >
        <Button>Edit Details</Button>
      </SimpleDialog>
    </XStack>
  );
}
