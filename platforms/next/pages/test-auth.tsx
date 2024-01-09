/**
 * File: /pages/test-auth.tsx
 * Project: @platform/next
 * File Created: 09-01-2024 01:49:14
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

/**
 * File: /pages/test-auth.tsx
 * Project: @platform/next
 * File Created: 09-01-2024 01:49:14
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

import type { Session } from '../app/api/auth/[...nextauth]/route';
import { useEffect } from 'react';
import { useSession as nextUseSession, signOut, signIn } from 'next-auth/react';

export function useSession() {
  const nextSession = nextUseSession();
  return {
    ...nextSession,
    data: nextSession.data as Session,
  };
}

export default function TestAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'loading' && session?.err) signOut({ callbackUrl: '/' });
  }, [session, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  } else if (session) {
    return (
      <div>
        <div>{JSON.stringify(session)}</div>
        <button
          onClick={() => {
            keycloakSessionLogOut().then(() => signOut({ callbackUrl: '/' }));
          }}
        >
          Log out
        </button>
      </div>
    );
  }
  return <button onClick={() => signIn('keycloak')}>Log in</button>;
}

async function keycloakSessionLogOut() {
  await fetch(`/api/auth/logout`);
}
