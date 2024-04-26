/*
 *  File: /i18n/index.ts
 *  Project: app
 *  File Created: 04-04-2024 15:50:39
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import 'intl-pluralrules';
import i18n from 'i18next';
import locales from './locales';
import type { Resource, ResourceKey } from 'i18next';
import { MultiPlatform } from 'multiplatform.one';
import { defaultNamespace, defaultLocale, supportedLocales } from './config';
import { initReactI18next } from 'react-i18next';

const logger = console;

if (MultiPlatform.isNext && !MultiPlatform.isStatic) {
  logger.warn("next should not import 'app/i18n'");
}

export function i18nInit() {
  i18n.use(initReactI18next).init({
    defaultNS: defaultNamespace,
    lng: defaultLocale,
    resources: Object.entries(locales).reduce<Resource>((resources, [key, value]: [string, ResourceKey]) => {
      resources[key] = { [defaultNamespace]: value };
      return resources;
    }, {}),
    interpolation: {
      escapeValue: false,
    },
  });
}

export { supportedLocales, defaultLocale, defaultNamespace, i18n };
