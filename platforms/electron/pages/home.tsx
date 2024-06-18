/**
 * File: /pages/home.tsx
 * Project: @platform/electron
 * File Created: 15-06-2024 14:38:39
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

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from 'ui';
import { useIpcQuery } from '@multiplatform.one/react-query-electron-ipc';

export default function HomePage() {
  const { data } = useIpcQuery<{ hello: string }>({
    handler: 'test',
  });

  return (
    <>
      <Head>
        <title>Home - Nextron (basic-lang-typescript)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -<Link href="/next">Go to next page</Link>
        </p>
        <Image src="/images/logo.png" alt="Logo image" width={256} height={256} />
      </div>
      <div>
        <Button>Hello</Button>
        <div>{data?.hello}</div>
      </div>
    </>
  );
}
