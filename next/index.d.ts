/**
 * File: /next/index.d.ts
 * Project: multiplatform.one
 * File Created: 10-04-2023 18:15:11
 * Author: Clay Risser
 * -----
 * Last Modified: 21-04-2023 16:09:42
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
import type { SSRConfig, UserConfig } from 'next-i18next';

export declare function getBaseProps(locale: any, namespacesRequired?: string[]): Promise<SSRConfig>;

export declare function createGetProps(
  namespacesRequired?: string[],
  props?: Record<string, any>,
): ({ locale }: { locale: any }) => Promise<{
  props: {
    _nextI18Next?:
      | {
          initialI18nStore: any;
          initialLocale: string;
          ns: string[];
          userConfig: UserConfig | null;
        }
      | undefined;
  };
}>;

export declare function createGetStaticPaths(paths?: string[]): GetStaticPaths<{
  slug: string;
}>;

export declare const getStaticPaths: GetStaticPaths<{
  slug: string;
}>;

export declare const getStaticProps: ({ locale }: { locale: any }) => Promise<{
  props: {
    _nextI18Next?:
      | {
          initialI18nStore: any;
          initialLocale: string;
          ns: string[];
          userConfig: UserConfig | null;
        }
      | undefined;
  };
}>;

export declare const getInitialProps: ({ locale }: { locale: any }) => Promise<{
  props: {
    _nextI18Next?:
      | {
          initialI18nStore: any;
          initialLocale: string;
          ns: string[];
          userConfig: UserConfig | null;
        }
      | undefined;
  };
}>;
