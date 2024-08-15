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
  Text,
  Theme,
  XStack,
  YStack,
} from 'ui';
import { useForm } from '@tanstack/react-form';
import { useToastController } from '@tamagui/toast';
import { withDefaultLayout } from 'app/layouts/Default';
import { Eye, EyeOff } from '@tamagui/lucide-icons';

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
  currentlyWorking: boolean;
  phoneNumber: string;
  // companyName?: string;
  // jobTitle?: string;
  password: string;
}
export interface ErrorProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  introduction?: string;
  phoneNumber?: string;
  password?: string;
}

const FormScreen = () => {
  const toastController = useToastController();
  const [sliderValue, setSliderValue] = useState<number[]>([0]);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);
  const [progressColor, setProgressColor] = useState('red');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorProps>({});

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
      currentlyWorking: false,
      phoneNumber: '',
      // companyName: '',
      // jobTitle: '',
      password: '',
    },
    onSubmit: ({ value }) => {
      const _errors = {
        ...(!value.firstName && { firstName: 'first name is required.' }),
        ...(!value.lastName && { lastName: 'last name is required.' }),
        ...(!value.email && { email: 'email is required.' }),
        ...(value.email && !isEmailValid(value.email) && { email: 'invalid email address.' }),
        ...(!value.gender && { gender: 'gender is required.' }),
        ...(!value.introduction && { introduction: 'introduction is required.' }),
        ...(!value.phoneNumber && { phoneNumber: 'phone number is required.' }),
        ...(value.phoneNumber && !isPhoneNumberValid(value.phoneNumber) && { phoneNumber: 'invalid phone number.' }),
        ...(!value.password && { password: 'password is required.' }),
        ...(value.password && !isPasswordValid(value.password) && { password: 'invalid password' }),
      }
      setErrors(_errors);
      if (Object.values(_errors).some((error) => error)) {
        toastController.show('please fill all required fields');
        return;
      }
      if (value.c) value.languages.push('C');
      if (value.java) value.languages.push('Java');
      if (value.python) value.languages.push('Python');
      if (value.javaScript) value.languages.push('JavaScript');

      console.log('form submitted with values:', value);

      form.reset();
      setProgressValue(0);
      setProgressColor('black');
      setIsWorking(false);
      setErrors({});
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
    const trimmedValue = value.replace(/^\s+/, '');
    const introduction = trimmedValue.length > 0 ? ` ${trimmedValue}` : ' ';
    form.setFieldValue('introduction', introduction);
  };
  const handleChangeEmail = (value: string) => {
    const email = value.replace(/\s+/g, '');
    let message: string | undefined;
    const startsWithValidChar = /^[a-zA-Z]/.test(email);
    const atSymbolCount = (email.match(/@/g) || []).length;
    const hasAtSymbol = atSymbolCount === 1;
    const domainPart = email.split('@')[1];
    const dotCount = ((domainPart && domainPart.match(/\./g)) || []).length;
    const hasDotAfterAt = dotCount === 1 && /^[a-zA-Z]+\.[a-zA-Z]+$/.test(domainPart || '');
    const endsWithValidChar = /[a-zA-Z]$/.test(email);

    if (!startsWithValidChar) {
      message = 'email must start with a letter';
    } else if (!hasAtSymbol) {
      message = 'email must contain "@" symbol';
    } else if (!hasDotAfterAt) {
      message = 'email must contain exactly one "." in the domain part, with letters before and after the "."';
    } else if (!endsWithValidChar) {
      message = 'email must end with a letter';
    }
    setErrors(prev => ({
      ...prev,
      email: message
    }))
    form.setFieldValue('email', email);
  };
  const handlePhoneNumberChange = (value: string) => {
    const formattedValue = value.replace(/\D/g, '').slice(0, 10);
    form.setFieldValue('phoneNumber', formattedValue);
  };
  const handleSwitchChange = (checked: boolean) => {
    setIsWorking(checked);
  };
  const handlePasswordChange = (value: string) => {
    const password = value.replace(/\s+/g, '');
    let message: string | undefined;
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

    if (password.length < 8 || !(hasUppercase && hasLowercase && hasDigit && hasSpecialChar)) {
      message = 'password must contains at least 8 chars with uppercase, lowercase, digit, and special char';
      setProgressColor('red');
    } else {
      message = 'strong password';
      setProgressColor('green');
    }
    progress = Math.min(progress, 100);
    setProgressValue(progress);
    setErrors(prev => ({
      ...prev,
      password: message
    }))
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
                    borderColor: errors.firstName ? 'red' : undefined,
                    borderWidth: errors.firstName ? 2 : 1
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
                    borderColor: errors.lastName ? 'red' : undefined,
                    borderWidth: errors.lastName ? 2 : 1
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
                    borderColor: errors.email ? 'red' : undefined,
                    borderWidth: errors.email ? 2 : 1
                  }}
                  onChangeText={handleChangeEmail}
                />
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
                    borderColor: errors.phoneNumber ? 'red' : undefined,
                    borderWidth: errors.phoneNumber ? 2 : 1
                  }}
                  onChangeText={handlePhoneNumberChange}
                />
                {errors.phoneNumber && <Paragraph color="red">{errors.phoneNumber}</Paragraph>}
              </YStack>
              <YStack gap="$2">
                <XStack>
                  <FieldInput
                    form={form}
                    name="password"
                    required
                    inputProps={{
                      placeholder: 'Password*',
                      secureTextEntry: !showPassword,
                      borderColor: errors.password ? progressColor : undefined,
                      borderWidth: errors.password ? 2 : 1
                    }}
                    onChangeText={handlePasswordChange}
                    width="100%"
                    minWidth={250}
                    maxWidth={550}
                  />
                  <Paragraph
                    onPress={() => setShowPassword(!showPassword)}

                    position='absolute'
                    right={10}
                    top='50%'
                    transform={[{ translateY: -12 }]}

                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Paragraph>
                </XStack>
                {errors.password && <FieldProgress
                  value={progressValue}
                  size="$1"
                  animation="bouncy"
                  padding="$0.5"
                  borderColor={progressColor}
                  indicatorProps={{ bg: progressColor }}
                />}
                <Paragraph gap="$1" color={progressColor}>
                  {errors.password}
                </Paragraph>
              </YStack>
              <YStack gap="$0">
                <FieldRadioGroup gap="$0.8" name="gender" label="Gender" required form={form}>
                  <YStack>
                    <FieldRadioGroupItem value="male">
                      <Label
                        color={errors.gender ? 'red' : undefined}
                      >
                        Male
                      </Label>
                    </FieldRadioGroupItem>
                    <FieldRadioGroupItem value="female">
                      <Label
                        color={errors.gender ? 'red' : undefined}
                      >
                        Female
                      </Label>
                    </FieldRadioGroupItem>
                    <FieldRadioGroupItem value="other">
                      <Label
                        color={errors.gender ? 'red' : undefined}
                      >
                        Other
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
                    borderColor: errors.introduction ? 'red' : undefined,
                    borderWidth: errors.introduction ? 2 : 1
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
                padding="$2"
                onValueChange={setSliderValue}
              />
              <Paragraph>Travel Percentage: {sliderValue}%</Paragraph>
              <FieldSwitch
                form={form}
                name="currentlyWorking"
                label="Currently Working"
                onCheckedChange={handleSwitchChange}
                checked={isWorking}
              />
              {
                isWorking ? <Text>Working</Text> : <Text>Not Working</Text>
              }
              {/* {isWorking && (
                <YStack gap="$4" flexWrap="wrap" w="100%">

                  <FieldInput form={form} name="companyName" inputProps={{ placeholder: 'Company Name' }} />
                  <FieldInput form={form} name="jobTitle" inputProps={{ placeholder: 'Job Title' }} />
                </YStack>
              )} */}
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
