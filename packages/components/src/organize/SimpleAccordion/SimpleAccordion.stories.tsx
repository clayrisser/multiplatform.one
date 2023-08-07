import { SimpleAccordion } from '.';
import React from 'react';

export default {
  title: 'organize/SimpleAccordion',
  component: SimpleAccordion,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const simpleAccordion = (args) => <SimpleAccordion {...args} />;
