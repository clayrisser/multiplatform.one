/**
 * File: /next/index.d.ts
 * Project: multiplatform.one
 * File Created: 26-01-2023 09:18:06
 * Author: Clay Risser
 * -----
 * Last Modified: 26-01-2023 09:18:09
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

import type { GetStaticPaths } from 'next';
export declare function getBaseStaticProps(
  locale: any,
  namespacesRequired?: string[],
): Promise<import('next-i18next').SSRConfig>;
export declare function createGetStaticProps(namespacesRequired?: string[]): ({ locale }: { locale: any }) => Promise<{
  props: import('next-i18next').SSRConfig;
}>;
export declare function createGetStaticPaths(paths?: string[]): GetStaticPaths<{
  slug: string;
}>;
export declare const getStaticPaths: GetStaticPaths<{
  slug: string;
}>;
export declare const getStaticProps: ({ locale }: { locale: any }) => Promise<{
  props: import('next-i18next').SSRConfig;
}>;
