/**
 * File: /src/hooks/useSupportedLocales/index.ts
 * Project: multiplatform.one
 * File Created: 28-01-2023 12:44:12
 * Author: Clay Risser
 * -----
 * Last Modified: 23-02-2023 07:33:18
 * Modified By: Clay Risser
 * -----
 * BitSpur (c) Copyright 2022 - 2023
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

import { useState, useEffect } from 'react';
import { MultiPlatform } from '../../multiplatform';

export function useSupportedLocales(): string[] | undefined {
  const [supportedLocales, setSupportedLocales] = useState<string[]>();

  useEffect(() => {
    (async () => {
      if (MultiPlatform.isNext && !MultiPlatform.isStatic) {
        const getConfig = (await import('next/config.js')).default;
        setSupportedLocales([
          ...((typeof getConfig === 'function' && getConfig()?.publicRuntimeConfig?.i18n?.languages) ||
            (await import('next-i18next')).i18n?.languages || ['en']),
        ]);
      } else {
        // @ts-ignore
        setSupportedLocales((await import('app/i18n')).supportedLocales);
      }
    })();
  }, []);

  return supportedLocales;
}
