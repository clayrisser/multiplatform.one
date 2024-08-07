/**
 * File: /screens/form/index.tsx
 * Project: app
 * File Created: 07-08-2024 11:44:41
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
  Card,
  // AlertDialog,
  // Button,
  // Card,
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
  // SimpleAlertDialog,
  SubmitButton,
  Theme,
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
  // const [open, setOpen] = useState<boolean>(false);
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
      const email = value.email;
      const firstName = value.firstName;
      const lastName = value.lastName;
      const gender = value.gender;
      const introduction = value.introduction;
      if (!firstName || !lastName || !email || !gender || !introduction) {
        toastController.show('Enter all Required details');
        return;
      }

      console.log(email);
      if (!isEmailValid(email)) {
        toastController.show('Invalid email address');
        // setOpen(true);
        return; // Prevent form submission
      }
      if (value.c) {
        value.languages.push('C');
      }
      if (value.java) {
        value.languages.push('Java');
      }
      if (value.python) {
        value.languages.push('Python');
      }
      if (value.javaScript) {
        value.languages.push('JavaScript');
      }

      console.log('Form submitted with values:', value);
      form.reset(); // Reset the form fields after submission
    },
  });

  return (
    <YStack ai="center" jc="center">
      <Card w={600} margin="$2" elevate padding="$1">
        <ScrollView alignItems="center">
          <YStack>
            <YStack w={500} marginTop="$2">
              <YStack w={590} bg="$background" margin="$2" marginLeft="$-8" marginRight="$-1">
                <Theme name="dark_blue_active">
                  <Heading ai="center" jc="center" marginLeft={220} color="$blue10">
                    Registration Form
                  </Heading>
                </Theme>
              </YStack>
              <YStack gap="$4" flexWrap="wrap">
                <FieldInput
                  form={form}
                  name="firstName"
                  required
                  inputProps={{
                    placeholder: 'FirstName',
                  }}
                />
                <FieldInput
                  form={form}
                  name="lastName"
                  inputProps={{
                    placeholder: 'LastName',
                  }}
                  required
                />
                <FieldInput
                  form={form}
                  name="email"
                  inputProps={{
                    placeholder: 'Email',
                  }}
                  required
                />
                <FieldRadioGroup gap="$0.8" name="gender" label="gender" required form={form}>
                  <YStack paddingLeft="$6" gap="$2">
                    <FieldRadioGroupItem value="male">
                      <Label>Male</Label>
                    </FieldRadioGroupItem>
                    <FieldRadioGroupItem value="female">
                      <Label>Female</Label>
                    </FieldRadioGroupItem>
                  </YStack>
                </FieldRadioGroup>
                <Label>languages</Label>
                <YStack paddingLeft="$6" marginTop="$-6">
                  <FieldCheckbox label="C" name="c" form={form} />
                  <FieldCheckbox label="Java" name="java" form={form} />
                  <FieldCheckbox label="Python" name="python" form={form} />
                  <FieldCheckbox label="JavaScript" name="javaScript" form={form} />
                </YStack>
                <FieldTextArea
                  textAreaProps={{
                    placeholder: 'Write something about yourself...',
                  }}
                  name="introduction"
                  form={form}
                  required
                  margin="$0.5"
                />
                <FieldSelectSimple label="role" name="role" form={form}>
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
                <SubmitButton
                  form={form}
                  bg="$blue10"
                  color="white"
                  w="$9"
                  marginBottom="$2"
                  left={410}
                  hoverStyle={{ bg: '$backgroundHover' }}
                >
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
      </Card>
    </YStack>
  );
};

export default withDefaultLayout(FormScreen);
