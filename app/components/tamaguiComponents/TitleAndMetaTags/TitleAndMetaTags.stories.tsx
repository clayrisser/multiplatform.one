import React from 'react';
import { TitleAndMetaTags } from './index';

export default {
  title: 'app/tamaguiComponents/TitleAndMetaTags',
  component: TitleAndMetaTags,
  parameters: { status: { type: 'beta' } },
};
export const main = () => <TitleAndMetaTags />;
