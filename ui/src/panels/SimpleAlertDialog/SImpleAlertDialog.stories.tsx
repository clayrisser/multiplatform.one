import React from 'react';
import { SimpleAlertDialog } from './index';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'panels/SimpleAlertDialog',
  component: SimpleAlertDialog,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <SimpleAlertDialog
    title="Are you sure?"
    description="This action cannot be undone"
    cancel="Cancel"
    accept="Delete"
    // asChild={true}
  >
    Hellooo
  </SimpleAlertDialog>
);
export default meta;
