/**
 * File: /src/next/index.ts
 * Project: multiplatform.one
 * File Created: 26-01-2023 08:48:52
 * Author: Clay Risser
 * -----
 * Last Modified: 26-01-2023 09:17:36
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
import type { GetStaticPaths } from 'next';
import { MultiPlatform } from '../multiplatform';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getBaseStaticProps(locale: any, namespacesRequired: string[] = []) {
  return MultiPlatform.isNext() && (getConfig ? getConfig() : {})?.publicRuntimeConfig?.NEXT_STATIC !== '1'
    ? await serverSideTranslations(locale, ['common', ...namespacesRequired])
    : {};
}

export function createGetStaticProps(namespacesRequired: string[] = []) {
  return async ({ locale }: { locale: any }) => ({
    props: await getBaseStaticProps(locale, namespacesRequired),
  });
}

export function createGetStaticPaths(paths: string[] = []): GetStaticPaths<{ slug: string }> {
  return async () => ({
    paths,
    fallback: 'blocking',
  });
}

export const getStaticPaths = createGetStaticPaths();

export const getStaticProps = createGetStaticProps();
