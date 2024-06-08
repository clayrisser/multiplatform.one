/**
 * File: /src/keycloak-theme/login/pages/Login.stories.tsx
 * Project: @platform/keycloak
 * File Created: 08-06-2024 10:54:54
 * Author: Clay Risser
 * Author: Joseph Garrone
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

import type { Meta, StoryObj } from '@storybook/react';
import { createPageStory } from '../createPageStory';

const { PageStory } = createPageStory({
  pageId: 'login.ftl',
});

const meta = {
  title: 'login/Login',
  component: PageStory,
} satisfies Meta<typeof PageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PageStory />,
};

export const WithoutPasswordField: Story = {
  render: () => <PageStory kcContext={{ realm: { password: false } }} />,
};

export const WithoutRegistration: Story = {
  render: () => <PageStory kcContext={{ realm: { registrationAllowed: false } }} />,
};

export const WithoutRememberMe: Story = {
  render: () => <PageStory kcContext={{ realm: { rememberMe: false } }} />,
};

export const WithoutPasswordReset: Story = {
  render: () => <PageStory kcContext={{ realm: { resetPasswordAllowed: false } }} />,
};

export const WithEmailAsUsername: Story = {
  render: () => <PageStory kcContext={{ realm: { loginWithEmailAllowed: false } }} />,
};

export const WithPresetUsername: Story = {
  render: () => <PageStory kcContext={{ login: { username: 'email@example.com' } }} />,
};

export const WithImmutablePresetUsername: Story = {
  render: () => (
    <PageStory
      kcContext={{
        auth: {
          attemptedUsername: 'email@example.com',
          showUsername: true,
        },
        usernameHidden: true,
        message: { type: 'info', summary: 'Please re-authenticate to continue' },
      }}
    />
  ),
};

export const WithSocialProviders: Story = {
  render: () => (
    <PageStory
      kcContext={{
        social: {
          displayInfo: true,
          providers: [
            { loginUrl: 'google', alias: 'google', providerId: 'google', displayName: 'Google' },
            { loginUrl: 'microsoft', alias: 'microsoft', providerId: 'microsoft', displayName: 'Microsoft' },
            { loginUrl: 'facebook', alias: 'facebook', providerId: 'facebook', displayName: 'Facebook' },
            { loginUrl: 'instagram', alias: 'instagram', providerId: 'instagram', displayName: 'Instagram' },
            { loginUrl: 'twitter', alias: 'twitter', providerId: 'twitter', displayName: 'Twitter' },
            { loginUrl: 'linkedin', alias: 'linkedin', providerId: 'linkedin', displayName: 'LinkedIn' },
            {
              loginUrl: 'stackoverflow',
              alias: 'stackoverflow',
              providerId: 'stackoverflow',
              displayName: 'Stackoverflow',
            },
            { loginUrl: 'github', alias: 'github', providerId: 'github', displayName: 'Github' },
            { loginUrl: 'gitlab', alias: 'gitlab', providerId: 'gitlab', displayName: 'Gitlab' },
            { loginUrl: 'bitbucket', alias: 'bitbucket', providerId: 'bitbucket', displayName: 'Bitbucket' },
            { loginUrl: 'paypal', alias: 'paypal', providerId: 'paypal', displayName: 'PayPal' },
            { loginUrl: 'openshift', alias: 'openshift', providerId: 'openshift', displayName: 'OpenShift' },
          ],
        },
      }}
    />
  ),
};
