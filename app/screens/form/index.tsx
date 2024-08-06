/**
 * File: /screens/form/index.tsx
 * Project: app
 * File Created: 06-08-2024 15:43:30
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useState } from 'react';
import {
  AlertDialog,
  Button,
  Card,
  FieldCheckbox,
  FieldInput,
  FieldRadioGroup,
  FieldRadioGroupItem,
  FieldSelectSimple,
  FieldTextArea,
  Heading,
  Label,
  ScrollView,
  Select,
  SimpleAlertDialog,
  SubmitButton,
  YStack,
} from 'ui';
import { useForm } from '@tanstack/react-form';
import { useToastController } from '@tamagui/toast';
import { withDefaultLayout } from 'app/layouts/Default';

// Define the shape of your form data
export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'male' | 'female' | '';
  languages: string[];
  introduction: string;
  role: string;
  c: boolean;
  java: boolean;
  python: boolean;
  javaScript: boolean;
}

// Utility function for email validation

// Form component
const FormScreen = () => {
  const toastController = useToastController();
  const [open, setOpen] = useState<boolean>(false);
  const isEmailValid = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  // Initialize form with default values and submission handler
  const form = useForm<RegisterForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      languages: [],
      introduction: '',
      role: '',
      c: false,
      java: false,
      python: false,
      javaScript: false,
    },
    onSubmit: ({ value }) => {
      console.log('Form values on submit:', value);

      const email = value.email;
      console.log(email);
      if (!isEmailValid(email)) {
        toastController.show('Invalid email address');
        // setOpen(true);
        return; // Prevent form submission
      }

      console.log('Form submitted with values:', value);
      form.reset(); // Reset the form fields after submission
    },
  });

  return (
    <ScrollView alignItems="center">
      <YStack>
        <YStack w={600} marginTop="$2">
          <Heading color="white" bg="$blue10">
            Fill The Form
          </Heading>
          <YStack gap="$4" flexWrap="wrap">
            <FieldInput form={form} label="Enter firstName" name="firstName" required />
            <FieldInput form={form} label="Enter lastName" name="lastName" required />
            <FieldInput form={form} label="Enter email" name="email" required />
            <FieldRadioGroup gap="$0.8" label="Select gender" name="gender" required form={form}>
              <YStack paddingLeft="$6" gap="$2">
                <FieldRadioGroupItem value="male">
                  <Label>Male</Label>
                </FieldRadioGroupItem>
                <FieldRadioGroupItem value="female">
                  <Label>Female</Label>
                </FieldRadioGroupItem>
              </YStack>
            </FieldRadioGroup>
            <Label>Select language</Label>
            <YStack paddingLeft="$6" marginTop="$-6">
              <FieldCheckbox label="C" name="c" form={form} />
              <FieldCheckbox label="Java" name="java" form={form} />
              <FieldCheckbox label="Python" name="python" form={form} />
              <FieldCheckbox label="JavaScript" name="javaScript" form={form} />
            </YStack>
            <FieldTextArea label="Introduce yourself" name="introduction" form={form} required margin="$0.5" />
            <FieldSelectSimple label="Select one role" name="role" form={form}>
              <Select.Item value="Software Developer" index={0}>
                <Select.ItemText>Software Developer</Select.ItemText>
              </Select.Item>
              <Select.Item value="Data Analyst" index={1}>
                <Select.ItemText>Data Analyst</Select.ItemText>
              </Select.Item>
              <Select.Item value="Web Developer" index={2}>
                <Select.ItemText>Web Developer</Select.ItemText>
              </Select.Item>
            </FieldSelectSimple>
            <SubmitButton form={form} left={500} bg="$blue10" color="white" w="$9">
              Submit
            </SubmitButton>
          </YStack>
        </YStack>
      </YStack>
      {/* <SimpleAlertDialog
        // onAccept={() => console.log('hello')}
        // open={open}
        // onOpenChange={setOpen}
        // description="invalid mail"
        // title="Email Error"
        trigger={<Button>triger Alert</Button>}
      >
        <YStack gap="$2">
          hello
          <AlertDialog.Cancel asChild>
            <Button>Cancel</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button>Submit</Button>
          </AlertDialog.Action>
        </YStack>
      </SimpleAlertDialog> */}
    </ScrollView>
  );
};

export default withDefaultLayout(FormScreen);
