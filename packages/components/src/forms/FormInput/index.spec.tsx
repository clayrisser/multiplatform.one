/**
 * File: /src/forms/FormInput/index.spec.tsx
 * Project: @multiplatform.one/components
 * File Created: 02-06-2024 07:15:19
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

import React from 'react';
import { FormInput } from './index';
import { TamaguiProvider } from 'tamagui';
import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

const tamaguiConfig = createTamagui(config);

describe('SimpleImage component', () => {
  it('renders correctly', () => {
    render(
      <TamaguiProvider config={tamaguiConfig}>
        <FormInput name="test" />
      </TamaguiProvider>,
    );
    expect(screen.getByRole('textbox')).toHaveTextContent('');
  });
});
