/**
 * File: /screens/form/index.tsx
 * File: /screens/form/index.tsx
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

/* eslint-disable max-lines-per-function */
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
  H1,
  Label,
  Paragraph,
  ScrollView,
  Select,
  SubmitButton,
  Theme,
  XStack,
  YStack,
} from 'ui';
import { useForm } from '@tanstack/react-form';
import { useToastController } from '@tamagui/toast';
import { withDefaultLayout } from 'app/layouts/Default';
import { Eye, EyeOff } from '@tamagui/lucide-icons';

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
// Form component
const FormScreen = () => {
  const toastController = useToastController();
  const [sliderValue, setSliderValue] = useState<number[]>([0]);
  const [isWorking, setIsWorking] = useState<boolean>(false); // State for switch
  const [password, setPassword] = useState<string>('');
  const [progressValue, setProgressValue] = useState<number>(0);
  let [progressColor, setProgressColor] = useState('black');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    introduction: '',
    phoneNumber: '',
    password: '',
  });

  const isEmailValid = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const isPasswordValid = (password: string) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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
      const newErrors = {
        firstName: value.firstName ? '' : 'First name is required.',
        lastName: value.lastName ? '' : 'Last name is required.',
        email: value.email ? (isEmailValid(value.email) ? '' : 'Invalid email address.') : 'Email is required.',
        gender: value.gender ? '' : 'Gender is required.',
        introduction: value.introduction ? '' : 'Introduction is required.',
        phoneNumber: value.phoneNumber
          ? isPhoneNumberValid(value.phoneNumber)
            ? ''
            : ' Invalid Phone number .'
          : 'Phone number is required.',
        password: value.password
          ? isPasswordValid(value.password)
            ? ''
            : ' Invalid Password'
          : 'Password is required.',
      };

      setErrors(newErrors);

      if (Object.values(newErrors).some((error) => error)) {
        toastController.show('Please enter all required detail before submitting.');
        return; // Exit early if validation fails
      }

      // if (!firstName || !lastName || !email || !gender || !introduction || !phoneNumber || !password) {
      //   toastController.show('Enter all * Required details');
      //   return;
      // }

      // if (!isEmailValid(email)) {
      //   toastController.show('Invalid email address');
      //   return; // Prevent form submission
      // }
      // if (!isPhoneNumberValid(phoneNumber)) {
      //   toastController.show('Phone number must be exactly 10 digits');
      //   return; // Prevent form submission
      // }
      // if (!isPasswordValid(password)) {
      //   toastController.show('Enter valid password it should be more than 8 letters');
      //   return;
      // }
      if (value.c) value.languages.push('C');
      if (value.java) value.languages.push('Java');
      if (value.python) value.languages.push('Python');
      if (value.javaScript) value.languages.push('JavaScript');

      console.log('Form submitted with values:', value);

      form.reset(); // Reset the form fields after submission
      setSliderValue([0]);
      setProgressValue(0);
      setProgressColor('black');
      setPasswordMessage('');
      setIsWorking(false);
      setErrors({
        // Reset errors state if needed
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        introduction: '',
        phoneNumber: '',
        password: '',
      });
    },
  });
  const handleFirstName = (value: string) => {
    const firstName = value.replace(/\s+/g, '');
    form.setFieldValue('firstName', firstName);
  };
  const handleLastName = (value: string) => {
    const lastName = value.replace(/\s+/g, '');
    form.setFieldValue('lastName', lastName);
  };
  const handleIntroduction = (value: string) => {
    // Trim leading and trailing spaces
    const trimmedValue = value.replace(/^\s+/, '');

    // Add a leading space only if the trimmed value is not empty
    const introduction = trimmedValue.length > 0 ? ` ${trimmedValue}` : ' ';

    // Set the field value
    form.setFieldValue('introduction', introduction);
  };
  const handleChangeEmail = (value: string) => {
    const email = value.replace(/\s+/g, '');
    let message = '';
    const startsWithValidChar = /^[a-zA-Z]/.test(email);
    const atSymbolCount = (email.match(/@/g) || []).length;
    const hasAtSymbol = atSymbolCount === 1;
    const [localPart, domainPart] = email.split('@');
    const dotCount = ((domainPart && domainPart.match(/\./g)) || []).length;
    const hasDotAfterAt = dotCount === 1 && /^[a-zA-Z]+\.[a-zA-Z]+$/.test(domainPart || '');
    const endsWithValidChar = /[a-zA-Z]$/.test(email);

    if (!startsWithValidChar) {
      message = 'Email must start with a letter';
    } else if (!hasAtSymbol) {
      message = 'Email must contain "@" symbol';
    } else if (!hasDotAfterAt) {
      message = 'Email must contain exactly one "." in the domain part, with letters before and after the "."';
    } else if (!endsWithValidChar) {
      message = 'Email must end with a letter';
    }
    setEmailError(message);
    form.setFieldValue('email', email);
  };

  const handlePhoneNumberChange = (value: string) => {
    const formattedValue = value.replace(/\D/g, '').slice(0, 10);
    form.setFieldValue('phoneNumber', formattedValue);
  };
  // Handler for switch change
  const handleSwitchChange = (checked: boolean) => {
    setIsWorking(checked);
  };

  const handlePasswordChange = (value: string) => {
    const password = value.replace(/\s+/g, '');
    let message = '';
    let progress = 0;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    if (password.length >= 8) {
      progress += 20;
    }
    if (hasUppercase) progress += 20;
    if (hasLowercase) progress += 20;
    if (hasDigit) progress += 20;
    if (hasSpecialChar) progress += 20;

    if (password.length === 0) {
      message = 'Password is required.';
      progressColor = 'red';
    } else if (password.length < 8 || !(hasUppercase && hasLowercase && hasDigit && hasSpecialChar)) {
      message =
        'Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.';
      progressColor = 'red';
    } else {
      message = 'Strong password';
      progressColor = 'green';
    }
    progress = Math.min(progress, 100);

    setPassword(value);
    setProgressValue(progress);
    setProgressColor(progressColor);
    setPasswordMessage(message);
    form.setFieldValue('password', password);
  };

  return (
    <YStack width="100%" jc="center" ai="center">
      <Card width="100%" minWidth={320} maxWidth={550} padding="$4" elevate margin="$2">
        <ScrollView>
          <YStack gap="$3">
            <Theme name="dark">
              <H1 theme="blue_active" textAlign="center" color="$backgroundFocus">
                Registration Form
              </H1>
            </Theme>
            <YStack gap="$4" padding="$2">
              <YStack gap="$0.5">
                <FieldInput
                  form={form}
                  name="firstName"
                  required
                  inputProps={{
                    placeholder: 'First Name *',
                    style: { borderColor: errors.firstName ? 'red' : '', borderWidth: errors.firstName ? 2 : 1 },
                  }}
                  onChangeText={handleFirstName}
                />
                {errors.firstName && <Paragraph color="red">{errors.firstName}</Paragraph>}
              </YStack>
              <YStack gap="$0.5">
                <FieldInput
                  form={form}
                  name="lastName"
                  required
                  inputProps={{
                    placeholder: 'Last Name *',
                    style: { borderColor: errors.lastName ? 'red' : '', borderWidth: errors.lastName ? 2 : 1 },
                  }}
                  onChangeText={handleLastName}
                />
                {errors.lastName && <Paragraph color="red">{errors.lastName}</Paragraph>}
              </YStack>
              <YStack gap="$1">
                <FieldInput
                  form={form}
                  name="email"
                  required
                  inputProps={{
                    placeholder: 'Email*',
                    style: { borderColor: errors.email ? 'red' : '', borderWidth: errors.email ? 2 : 1 },
                  }}
                  onChangeText={handleChangeEmail}
                />
                <Paragraph gap="$1">{emailError} </Paragraph>
                {errors.email && <Paragraph color="red">{errors.email}</Paragraph>}
              </YStack>
              <YStack gap="$0.5">
                <FieldInput
                  form={form}
                  name="phoneNumber"
                  required
                  inputProps={{
                    placeholder: 'Phone Number*',
                    keyboardType: 'numeric',
                    style: { borderColor: errors.phoneNumber ? 'red' : '', borderWidth: errors.phoneNumber ? 2 : 1 },
                  }}
                  onChangeText={handlePhoneNumberChange}
                />
                {errors.phoneNumber && <Paragraph color="red">{errors.phoneNumber}</Paragraph>}
              </YStack>
              <YStack gap="$0.5">
                <XStack>
                  <FieldInput
                    form={form}
                    name="password"
                    required
                    inputProps={{
                      placeholder: 'Password*',
                      secureTextEntry: !showPassword,
                      style: { borderColor: errors.password ? 'red' : '', borderWidth: errors.password ? 2 : 1 },
                    }}
                    onChangeText={handlePasswordChange}
                    width="100%"
                    minWidth={250}
                    maxWidth={550}
                  />
                  <Paragraph
                    onPress={() => setShowPassword(!showPassword)}
                    bg="$red"
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: [{ translateY: -12 }],
                    }}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Paragraph>
                </XStack>
                {errors.password && <Paragraph color="red">{errors.password}</Paragraph>}
              </YStack>
              <YStack gap="$0">
                <FieldProgress
                  value={progressValue}
                  size="$1"
                  animation="bouncy"
                  padding="$0.5"
                  borderColor={progressColor}
                  indicatorProps={{ bg: progressColor }}
                />
                <Paragraph gap="$1" color={progressColor}>
                  {passwordMessage}{' '}
                </Paragraph>
                <FieldRadioGroup gap="$0.8" name="gender" label="Gender" required form={form}>
                  <YStack>
                    <FieldRadioGroupItem value="male">
                      <Label
                        style={{
                          color: errors.gender ? 'red' : 'black', // Conditional styling for label color
                        }}
                      >
                        Male
                      </Label>
                    </FieldRadioGroupItem>
                    <FieldRadioGroupItem value="female">
                      <Label
                        style={{
                          color: errors.gender ? 'red' : 'black', // Conditional styling for label color
                        }}
                      >
                        Female
                      </Label>
                    </FieldRadioGroupItem>
                  </YStack>
                </FieldRadioGroup>
                {errors.gender && <Paragraph color="red">{errors.gender}</Paragraph>}
                <YStack>
                  <Label>Languages</Label>
                  <YStack>
                    <FieldCheckbox label="C" name="c" form={form} />
                    <FieldCheckbox label="Java" name="java" form={form} />
                    <FieldCheckbox label="Python" name="python" form={form} />
                    <FieldCheckbox label="JavaScript" name="javaScript" form={form} />
                  </YStack>
                </YStack>
              </YStack>
              <YStack gap="$0.5">
                <FieldTextArea
                  textAreaProps={{
                    placeholder: 'Write something about yourself... *',
                    style: { borderColor: errors.introduction ? 'red' : '', borderWidth: errors.introduction ? 2 : 1 },
                  }}
                  name="introduction"
                  form={form}
                  required
                  margin="$0.5"
                  onChangeText={handleIntroduction}
                />
                {errors.introduction && <Paragraph color="red">{errors.introduction}</Paragraph>}
              </YStack>
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
                padding="$2"
              />
              <Paragraph>Travel Percentage: {sliderValue[0]}%</Paragraph>
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
              <YStack flex={1} jc="flex-end" ai="flex-end">
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
          </YStack>
        </ScrollView>
      </Card>
    </YStack>
  );
};
export default withDefaultLayout(FormScreen);
