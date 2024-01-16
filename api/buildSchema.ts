/*
 *  File: /buildSchema.ts
 *  Project: gql
 *  File Created: 07-01-2024 14:06:26
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

// eslint-disable-next-line no-eval
eval('require')('reflect-metadata');
import path from 'path';
import { buildSchema } from '@multiplatform.one/typegraphql';
import { options } from './server';

buildSchema(options, path.resolve(__dirname, '../../gql/generated/schema.graphql'));
