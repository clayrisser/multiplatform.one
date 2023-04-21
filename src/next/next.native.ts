/**
 * File: /src/next/next.native.ts
 * Project: multiplatform.one
 * File Created: 26-01-2023 08:49:11
 * Author: Clay Risser
 * -----
 * Last Modified: 21-04-2023 16:04:26
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

export async function getBaseProps(_locale: any, _namespacesRequired: string[] = []) {
  return {};
}

export async function createGetProps(namespacesRequired: string[] = [], props: Record<string, any> = {}) {
  return async ({ locale }: { locale: any }) => ({
    props: {
      ...(await getBaseProps(locale, namespacesRequired)),
      ...props,
    },
  });
}

export async function createGetStaticPaths(paths: string[] = []) {
  return async () => ({
    paths,
    fallback: 'blocking',
  });
}

export const getStaticPaths = createGetStaticPaths();

export const getStaticProps = createGetProps();

export const getInitialProps = createGetProps();
