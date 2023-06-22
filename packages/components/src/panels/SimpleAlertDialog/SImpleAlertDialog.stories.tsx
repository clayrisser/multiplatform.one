import React from 'react';
import { SimpleAlertDialog } from './index';
import type { Meta } from '@storybook/react';
import { Button } from 'tamagui';

const meta: Meta = {
  title: 'panels/SimpleAlertDialog',
  component: SimpleAlertDialog,
  parameters: { status: { type: 'beta' } },
};

// uncomment this to control the dialog using the open prop

// export const main = () => {
//   return (
//     <SimpleAlertDialog
//       title="Are you sure?"
//       description="This action cannot be undone"
//       cancel="Cancel"
//       accept="Delete"
//       open={true}
//       onAccept={() => alert('Accepted')}
//     />
//   );
// };

export const main = () => (
  <SimpleAlertDialog
    title="Are you sure?"
    description="This action cannot be undone"
    cancel="Cancel"
    accept="Yes, Delete"
    onAccept={() => alert('accepted')}
  >
    <Button>Get Alert</Button>
  </SimpleAlertDialog>
);
export default meta;