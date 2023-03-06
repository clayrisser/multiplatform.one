import React from 'react';
import { MailingListSignUp } from './index';

export default {
  title: 'app/tamaguiComponents/MailingListSignUp',
  component: MailingListSignUp,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <MailingListSignUp />;
