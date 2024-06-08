/**
 * File: /src/keycloak-theme/login/pages/Terms.stories.tsx
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

import type { Meta, StoryObj } from '@storybook/react';
import { createPageStory } from '../createPageStory';

type Story = StoryObj<typeof meta>;

const { PageStory } = createPageStory({
  pageId: 'terms.ftl',
});

const meta = {
  title: 'login/Terms',
  component: PageStory,
} satisfies Meta<typeof PageStory>;

export const Primary: Story = {
  render: () => <PageStory />,
};

export default meta;
