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
  FieldCheckbox,
  FieldInput,
  FieldProgress,
  FieldRadioGroup,
  FieldRadioGroupItem,
  FieldSelectSimple,
  FieldSlider,
  FieldSwitch,
  FieldTextArea,
  Heading,
  Label,
  ScrollView,
  Select,
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
  travelPercentage: number[];
  profession: boolean;
  phoneNumber: string;
  companyName?: string;
  jobTitle?: string;
  password: string;
}

// Utility function for email validation

// Form component
const FormScreen = () => {
  const toastController = useToastController();
  const [sliderValue, setSliderValue] = useState<number[]>([0]);
  const [isWorking, setIsWorking] = useState<boolean>(false); // State for switch
  const [password, setPassword] = useState<string>('');
  const [progressValue, setProgressValue] = useState<number>(0);

  const isEmailValid = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const isPasswordValid = (password: string) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    return passwordPattern.test(password);
  };
  const isPhoneNumberValid = (phoneNumber: string) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phoneNumber);
  };
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
      travelPercentage: [0],
      profession: false,
      phoneNumber: '',
      companyName: '',
      jobTitle: '',
      password: '',
    },
    onSubmit: ({ value }) => {
      const { email, firstName, lastName, gender, introduction, phoneNumber, companyName, jobTitle, password } = value;
      if (!firstName || !lastName || !email || !gender || !introduction || !phoneNumber || !password) {
        toastController.show('Enter all Required details');
        return;
      }

      if (!isEmailValid(email)) {
        toastController.show('Invalid email address');
        return; // Prevent form submission
      }
      if (!isPhoneNumberValid(phoneNumber)) {
        toastController.show('Phone number must be exactly 10 digits');
        return; // Prevent form submission
      }
      if (!isPasswordValid(password)) {
        toastController.show('Enter valid password it should be more than 10 letters');
      }

      if (value.c) value.languages.push('C');
      if (value.java) value.languages.push('Java');
      if (value.python) value.languages.push('Python');
      if (value.javaScript) value.languages.push('JavaScript');

      console.log('Form submitted with values:', value);
      console.log('company', companyName);
      console.log('job', jobTitle);

      form.reset(); // Reset the form fields after submission
    },
  });

  // Handler for switch change
  const handleSwitchChange = (checked: boolean) => {
    setIsWorking(checked);
  };
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const length = value.length;
    setProgressValue((length / 10) * 100);
  };
  return (
    <YStack ai="center" jc="center" display="flex" flexWrap="wrap" padding="$2">
      <Card
        w="90%"
        margin="$2"
        display="flex"
        elevate
        padding="$2"
        flexWrap="wrap"
        maxWidth={600}
        ai="center"
        jc="center"
      >
        <ScrollView>
          <YStack w="100%" flexWrap="wrap" ai="center" jc="center" maxWidth={550} display="flex">
            <Theme name="dark_blue_active">
              <Heading ai="center" jc="center" color="$blue10">
                Registration Form
              </Heading>
            </Theme>
            <YStack gap="$4" flexWrap="wrap" display="flex" w="100%" maxWidth={550}>
              <FieldInput form={form} name="firstName" required inputProps={{ placeholder: 'First Name' }} />
              <FieldInput form={form} name="lastName" required inputProps={{ placeholder: 'Last Name' }} />
              <FieldInput form={form} name="email" required inputProps={{ placeholder: 'Email' }} />
              <FieldInput form={form} name="phoneNumber" required inputProps={{ placeholder: 'Phone Number' }} />
              <FieldInput
                form={form}
                name="password"
                required
                inputProps={{ placeholder: 'Password' }}
                onChangeText={handlePasswordChange}
              />
              <FieldProgress
                value={progressValue}
                size="$2"
                animation="bouncy"
                bg="black"
                borderColor="black"
                padding="$0.5"
              />
              <FieldRadioGroup gap="$0.8" name="gender" label="Gender" required form={form}>
                <YStack paddingLeft="$6" gap="$2" flexWrap="wrap">
                  <FieldRadioGroupItem value="male">
                    <Label>Male</Label>
                  </FieldRadioGroupItem>
                  <FieldRadioGroupItem value="female">
                    <Label>Female</Label>
                  </FieldRadioGroupItem>
                </YStack>
              </FieldRadioGroup>
              <Label>Languages</Label>
              <YStack paddingLeft="$6" marginTop="$-6" flexWrap="wrap" display="flex">
                <FieldCheckbox label="C" name="c" form={form} />
                <FieldCheckbox label="Java" name="java" form={form} />
                <FieldCheckbox label="Python" name="python" form={form} />
                <FieldCheckbox label="JavaScript" name="javaScript" form={form} />
              </YStack>
              <FieldTextArea
                textAreaProps={{ placeholder: 'Write something about yourself...' }}
                name="introduction"
                form={form}
                required
                margin="$0.5"
              />
              <FieldSelectSimple label="Role" name="role" form={form}>
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
              <FieldSlider
                form={form}
                name="travelPercentage"
                label="Travel Percentage"
                onValueChange={(e) => setSliderValue(e)}
              />
              <FieldSwitch
                form={form}
                name="profession"
                label="Currently Working"
                onCheckedChange={handleSwitchChange}
              />
              {isWorking && (
                <YStack gap="$4" flexWrap="wrap" w="100%">
                  <FieldInput form={form} name="companyName" inputProps={{ placeholder: 'Company Name' }} />
                  <FieldInput form={form} name="jobTitle" inputProps={{ placeholder: 'Job Title' }} />
                </YStack>
              )}
              <Theme name="dark_blue_active">
                <SubmitButton
                  form={form}
                  bg="$backgroundFocus"
                  color="white"
                  w="$9"
                  marginBottom="$2"
                  hoverStyle={{ bg: '$backgroundHover' }}
                >
                  Submit
                </SubmitButton>
              </Theme>
            </YStack>
          </YStack>
        </ScrollView>
      </Card>
    </YStack>
  );
};

export default withDefaultLayout(FormScreen);
