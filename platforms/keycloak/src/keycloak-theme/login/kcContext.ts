/*
 * File: /src/keycloak-theme/login/kcContext.ts
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

import { createGetKcContext } from 'keycloakify/login';

export type KcContextExtension =
  | { pageId: 'login.ftl' }
  | { pageId: 'my-extra-page-1.ftl' }
  | { pageId: 'my-extra-page-2.ftl'; someCustomValue: string }
  | { pageId: 'register.ftl'; authorizedMailDomains: string[] };

export const { getKcContext } = createGetKcContext<KcContextExtension>({
  mockData: [
    {
      pageId: 'login.ftl',
      locale: {
        currentLanguageTag: 'en',
      },
      // message: undefined,
      // message: { type: 'error', summary: 'This is an error' },
    },
    {
      pageId: 'my-extra-page-2.ftl',
      someCustomValue: 'foo bar baz',
    },
    {
      pageId: 'register-user-profile.ftl',
      locale: {
        currentLanguageTag: 'en',
      },
      profile: {
        attributes: [
          {
            validators: {
              pattern: {
                pattern: '^[a-zA-Z0-9]+$',
                'ignore.empty.value': true,
                'error-message': `\${alphanumericalCharsOnly}`,
              },
            },
            value: undefined,
            name: 'username',
          },
          {
            validators: {
              options: {
                options: ['male', 'female', 'non_binary', 'prefer_not_to_say'],
              },
            },
            displayName: `\${gender}`,
            annotations: {},
            required: true,
            groupAnnotations: {},
            readOnly: false,
            name: 'gender',
          },
        ],
      },
    },
    {
      pageId: 'register.ftl',
      authorizedMailDomains: [
        'example.com',
        'another-example.com',
        '*.yet-another-example.com',
        '*.example.com',
        'hello-world.com',
      ],
      messagesPerField: {
        printIfExists: <T>(fieldName: string, text: T) => {
          console.log({ fieldName });
          return fieldName === 'email' ? text : undefined;
        },
        existsError: (fieldName: string) => fieldName === 'email',
        get: (fieldName: string) => `Fake error for ${fieldName}`,
        exists: (fieldName: string) => fieldName === 'email',
      },
    },
  ],
  mockProperties: {
    MY_ENV_VARIABLE: 'Mocked value',
  },
});

export const { kcContext } = getKcContext({
  // mockPageId: 'login.ftl',
});

export type KcContext = NonNullable<ReturnType<typeof getKcContext>['kcContext']>;
