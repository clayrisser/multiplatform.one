/*
 *  File: /src/useTranslation/index.ts
 *  Project: multiplatform.one
 *  File Created: 22-06-2023 05:33:21
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2023
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

import { MultiPlatform } from 'multiplatform.one';
import { useTranslation as nextUseTranslation } from 'next-i18next';
import { useTranslation as reactUseTranslation } from 'react-i18next';

let useTranslation = reactUseTranslation;

if (MultiPlatform.isNext && !MultiPlatform.isStatic) {
  useTranslation = nextUseTranslation;
}

export { useTranslation };
