import React from 'react';
import { Preview } from './index';

export default {
  title: 'app/tamaguiComponents/Preview',
  components: Preview,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <Preview />;
