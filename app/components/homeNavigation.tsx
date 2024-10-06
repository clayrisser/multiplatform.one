/**
 * File: /components/homeNavigation.tsx
 * Project: app
 * File Created: 27-08-2024 17:47:44
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

import { Link } from "one";
import React from "react";
import { Paragraph, XStack } from "ui";

export const HomeNavigation = () => {
  return (
    <XStack>
      <Paragraph>already registered?</Paragraph>
      <Link href="/" color="$blue10">
        <Paragraph color="$blue10">home</Paragraph>
      </Link>
    </XStack>
  );
};
