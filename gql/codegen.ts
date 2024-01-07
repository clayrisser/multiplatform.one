/*
 *  File: /codegen.ts
 *  Project: api
 *  File Created: 07-01-2024 09:02:44
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './generated/schema.graphql',
  documents: [
    '**/*.{ts,tsx}',
    '../app/**/*.{ts,tsx}',
    '!../app/node_modules/**/*.{ts,tsx}',
    '!node_modules/**/*.{ts,tsx}',
  ],
  generates: {
    './generated/gql/': {
      preset: 'client',
    },
    './generated/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
