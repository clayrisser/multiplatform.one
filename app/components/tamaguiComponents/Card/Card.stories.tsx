import React from 'react';
import { Card } from './index';

export default {
  title: 'app/tamaguiComponents/Card',
  component: Card,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <Card>
    mini-throttle is a lightweight JavaScript library for throttling function calls. It provides a simple API for
    limiting the rate at which a function can be called, which can be useful for tasks such as rate-limiting API
    requests or reducing the frequency of expensive calculations.
  </Card>
);
