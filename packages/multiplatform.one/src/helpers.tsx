/**
 * File: /src/helpers.tsx
 * Project: multiplatform.one
 * File Created: 19-11-2024 20:26:31
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

import type { ComponentType } from "react";

const isPerformanceNow = typeof performance !== "undefined" && performance.now;
const date = isPerformanceNow ? performance : Date;
let _previousUnique: number;

export function fastUnique() {
  let unique = date.now();
  while (unique === _previousUnique) {
    unique = date.now();
  }
  _previousUnique = unique;
  if (isPerformanceNow) return Date.now() + unique.toString();
  return unique.toString();
}

export function isText(children: unknown) {
  if (Array.isArray(children)) {
    return (
      children.length > 1 &&
      typeof children[0] === "string" &&
      "_owner" in children[1] &&
      "_store" in children[1] &&
      "key" in children[1] &&
      "props" in children[1] &&
      "ref" in children[1] &&
      "type" in children[1]
    );
  }
  return typeof children === "string";
}

export function createWithLayout<LayoutProps>(
  Layout: ComponentType<LayoutProps>,
  extraLayouts: WithLayout[] = [],
  layoutProps?: Omit<LayoutProps, "children">,
): WithLayout {
  return ((Component: ComponentType<unknown>) => {
    return flattenLayouts(
      (props: unknown) => (
        <Layout {...(layoutProps as LayoutProps)}>
          <Component {...(props as any)} />
        </Layout>
      ),
      extraLayouts,
    );
  }) as WithLayout;
}

function flattenLayouts<Props>(
  layout: ComponentType<Props>,
  [...layouts]: WithLayout[],
): ComponentType<Props> {
  const currentLayout = layouts.pop();
  if (!currentLayout) return layout;
  return flattenLayouts(currentLayout(layout), layouts);
}

export type WithLayout = <Props>(
  Component: ComponentType<Props>,
) => ComponentType<Props>;

export const isDev =
  process.env.NODE_ENV === "development" ||
  (typeof __DEV__ !== "undefined" && __DEV__);
