/**
 * File: /pages/graphiql.tsx
 * Project: @platform/next
 * File Created: 14-01-2024 06:46:04
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

import type { GetServerSidePropsContext } from 'next';
import { withAuthenticated, getKeycloak } from '@multiplatform.one/keycloak';

export default withAuthenticated(() => <>{}</>);

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const keycloak = await getKeycloak(
    typeof window === 'undefined' ? (await import('../authOptions')).authOptions : undefined,
    ctx.req,
    ctx.res,
  );
  return {
    props: {},
    redirect: typeof keycloak !== 'undefined' &&
      keycloak.token && {
        destination: '/graphql',
        permanent: false,
      },
  };
}
