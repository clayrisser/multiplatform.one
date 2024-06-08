/**
 * File: /src/keycloak-theme/account/createPageStory.tsx
 * Project: @platform/keycloak
 * File Created: 08-06-2024 10:54:54
 * Author: Clay Risser
 * Author: Joseph Garrone
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

import KcApp from './KcApp';
import type { DeepPartial } from 'keycloakify/tools/DeepPartial';
import { getKcContext, type KcContext } from './kcContext';

export function createPageStory<PageId extends KcContext['pageId']>(params: { pageId: PageId }) {
  const { pageId } = params;
  function PageStory(params: { kcContext?: DeepPartial<Extract<KcContext, { pageId: PageId }>> }) {
    const { kcContext } = getKcContext({
      mockPageId: pageId,
      storyPartialKcContext: params.kcContext,
    });
    return (
      <>
        <link rel="stylesheet" type="text/css" href={`${import.meta.env.BASE_URL}fonts/WorkSans/font.css`} />
        <KcApp kcContext={kcContext} />
      </>
    );
  }
  return { PageStory };
}
