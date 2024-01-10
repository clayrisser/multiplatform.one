/*
 *  File: /src/encryption.ts
 *  Project: @platform/next
 *  File Created: 09-01-2024 01:23:34
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

import type Cryptr from 'cryptr';
import { MultiPlatform } from './multiplatform';

let _cryptr: Cryptr | undefined;

async function getCryptr() {
  if (MultiPlatform.isServer) {
    if (_cryptr) return _cryptr;
    const { default: Cryptr } = await import('cryptr');
    _cryptr = new Cryptr(process.env.SECRET || '-');
    return _cryptr;
  }
}

export async function encrypt(value: string) {
  const cryptr = await getCryptr();
  return cryptr?.encrypt(value);
}

export async function decrypt(encryptedValue: string) {
  const cryptr = await getCryptr();
  return cryptr?.decrypt(encryptedValue);
}
