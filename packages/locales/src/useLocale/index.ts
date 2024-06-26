/*
 *  File: /src/useLocale/index.ts
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

import i18n from 'i18next';
import { MultiPlatform } from 'multiplatform.one';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useLocale(): [string, (locale: string) => void] {
  const nextRouter = MultiPlatform.isNext && !MultiPlatform.isStatic ? useRouter() : null;
  const [locale, setLocale] = useState(nextRouter?.locale || i18n?.language || 'en');

  useEffect(() => {
    if (!nextRouter?.locale) return;
    setLocale(nextRouter.locale);
  }, [nextRouter?.locale]);

  useEffect(() => {
    if (nextRouter) return;
    function handleLanguageChanged(lng: string) {
      setLocale(lng);
    }
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  let changeLocale = (locale: string) => {
    i18n?.changeLanguage(locale);
  };
  if (nextRouter) {
    changeLocale = (locale: string) => {
      const { pathname, asPath, query } = nextRouter;
      nextRouter.push({ pathname, query }, asPath, { locale });
    };
  }

  return [locale, changeLocale];
}
