import React from 'react';
import DocSearch from './index';

export default {
  title: 'app/tamaguiComponents/DocSearch',
  component: DocSearch,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <DocSearch appId={'ssss'} apiKey={'dddrff'} indexName={'fffff'} initialScrollY={0} />;
