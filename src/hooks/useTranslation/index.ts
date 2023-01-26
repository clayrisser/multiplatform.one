/**
 * File: /src/hooks/useTranslation/index.ts
 * Project: multiplatform.one
 * File Created: 22-01-2023 11:33:46
 * Author: Clay Risser
 * -----
 * Last Modified: 26-01-2023 08:37:31
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2022 - 2023
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

import getConfig from 'next/config';
import { MultiPlatform } from '../../multiplatform';
import { useTranslation as nextUseTranslation } from 'next-i18next';
import { useTranslation as reactUseTranslation } from 'react-i18next';

let useTranslation = reactUseTranslation;

if (MultiPlatform.isNext() && (getConfig ? getConfig() : {})?.publicRuntimeConfig?.NEXT_STATIC !== '1') {
  useTranslation = nextUseTranslation;
}

export { useTranslation };
