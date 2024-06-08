/**
 * File: /src/next/next.tsx
 * Project: multiplatform.one
 * File Created: 23-04-2024 05:52:22
 * Author: Clay Risser
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

import type { GetStaticPaths } from 'next/types';
import { MultiPlatform } from '../multiplatform';

export async function getBaseProps(locale: any, namespacesRequired: string[] = []) {
  if (MultiPlatform.isNext && MultiPlatform.isServer && !MultiPlatform.isStatic) {
    const { serverSideTranslations } = await import('next-i18next/serverSideTranslations');
    return serverSideTranslations(locale, ['common', ...namespacesRequired]);
  }
  return {};
}

export function createGetProps(namespacesRequired: string[] = [], props: Record<string, any> = {}) {
  return async ({ locale }: { locale: any }) => ({
    props: {
      ...(await getBaseProps(locale, namespacesRequired)),
      ...props,
    },
  });
}

export function createGetInitialProps(props: Record<string, any> = {}) {
  return async () => ({ props });
}

export function createGetStaticPaths(paths: string[] = []): GetStaticPaths<{ slug: string }> {
  return async () => ({
    paths,
    fallback: 'blocking',
  });
}

export const getStaticPaths = createGetStaticPaths();

export const getStaticProps = createGetProps();

export const getInitialProps = createGetInitialProps();

export const getServerSideProps = createGetProps();
