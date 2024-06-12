/**
 * File: /src/keycloak-theme/login/pages/MyExtraPage2.tsx
 * Project: @platform/keycloak
 * File Created: 12-06-2024 09:07:27
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

import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';

export default function MyExtraPage1({
  kcContext,
  i18n,
  doUseDefaultCss,
  Template,
  classes,
}: PageProps<Extract<KcContext, { pageId: 'my-extra-page-2.ftl' }>, I18n>) {
  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      headerNode={
        <>
          Header <i>text</i>
        </>
      }
      infoNode={<span>footer</span>}
    >
      <form>{kcContext.someCustomValue}</form>
    </Template>
  );
}
