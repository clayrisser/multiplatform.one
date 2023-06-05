import React from 'react';
import { AjCodeBlock } from './index';

export default {
  title: 'code/AjCodeBlock',
  component: AjCodeBlock,
  parameters: { status: { type: 'beta' } },
};

export const main = (args: any) => <AjCodeBlock {...args} />;
main.args = {
  children: `
    function copyThis(){
        const tryTi = 'hello'
        return tryTi
    }`,
};
