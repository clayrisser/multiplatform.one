import React from 'react';
import { SimpleInput, SimpleInputProps } from '.';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'organize/SimpleInput',
  component: SimpleInput,
  parameters: { status: { type: 'beta' } },
  argTypes: {
    inputType: {
      control: {},
    },
  },
};

export const main = (args: SimpleInputProps) => <SimpleInput {...args} />;

const mainArgs: SimpleInputProps = {
  inputType: 'TEXT',
};

main.args = mainArgs;

export const passwordInputType = (args: SimpleInputProps) => <SimpleInput {...args} />;

const passwordInputTypeArgs: SimpleInputProps = {
  inputType: 'PASSWORD',
  secureTextEntry: true,
};

passwordInputType.args = passwordInputTypeArgs;

main.args = mainArgs;

export default meta;
