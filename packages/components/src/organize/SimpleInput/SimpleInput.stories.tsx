import React from 'react';
import { SimpleInput, SimpleInputProps } from '.';
import type { Meta, StoryObj } from '@storybook/react';

export default {
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
};

passwordInputType.args = passwordInputTypeArgs;

main.args = mainArgs;
