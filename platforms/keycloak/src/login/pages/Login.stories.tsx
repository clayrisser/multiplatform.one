/**
 * File: /src/keycloak-theme/login/pages/Login.stories.tsx
 * Project: @platform/keycloak
 * File Created: 12-06-2024 09:07:27
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

import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { createPageStory } from '../createPageStory';

const { PageStory } = createPageStory({
  pageId: 'login.ftl',
});

export const Default: ComponentStory<typeof PageStory> = () => <PageStory />;

export const WithoutPasswordField: ComponentStory<typeof PageStory> = () => (
  <PageStory
    kcContext={{
      realm: { password: false },
    }}
  />
);

export const WithoutRegistration: ComponentStory<typeof PageStory> = () => (
  <PageStory
    kcContext={{
      realm: { registrationAllowed: false },
    }}
  />
);

export const WithoutRememberMe: ComponentStory<typeof PageStory> = () => (
  <PageStory
    kcContext={{
      realm: { rememberMe: false },
    }}
  />
);

export const WithoutPasswordReset: ComponentStory<typeof PageStory> = () => (
  <PageStory
    kcContext={{
      realm: { resetPasswordAllowed: false },
    }}
  />
);

export const WithEmailAsUsername: ComponentStory<typeof PageStory> = () => (
  <PageStory
    kcContext={{
      realm: { loginWithEmailAllowed: false },
    }}
  />
);

export const WithPresetUsername: ComponentStory<typeof PageStory> = () => (
  <PageStory
    kcContext={{
      login: { username: 'email@example.com' },
    }}
  />
);

export const WithImmutablePresetUsername: ComponentStory<typeof PageStory> = () => (
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
);

export const WithSocialProviders: ComponentStory<typeof PageStory> = () => (
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
);

export default {
  title: 'login/Login',
  component: PageStory,
} as ComponentMeta<typeof PageStory>;
