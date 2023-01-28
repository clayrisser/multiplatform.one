/**
 * File: /src/hooks/useLocale/index.native.ts
 * Project: multiplatform.one
 * File Created: 28-01-2023 11:29:31
 * Author: Clay Risser
 * -----
 * Last Modified: 28-01-2023 12:32:04
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

import { useState } from 'react';
import i18n from 'i18next';
import { useEffect } from 'react';

export function useLocale(): [string, (locale: string) => void] {
  const [locale, setLocale] = useState(i18n?.language || 'en');

  useEffect(() => {
    function handleLanguageChanged(lng: string) {
      setLocale(lng);
    }
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  function changeLocale(locale: string) {
    i18n?.changeLanguage(locale);
  }

  return [locale, changeLocale];
}
