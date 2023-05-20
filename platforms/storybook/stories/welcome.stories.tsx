import React from 'react';
import { H1 } from 'tamagui';

export interface Hello {
  world: string;
}

export default {
  title: 'Welcome',
};

export const welcome = () => <H1>Welcome</H1>;
