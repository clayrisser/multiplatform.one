/*
 *  File: /src/decorators/controller.decorator.ts
 *  Project: @multiplatform.one/typegraphql-nestjs-decorators
 *  File Created: 26-10-2023 14:57:54
 *  Author: dharmendra
 *  -----
 *  BitSpur (c) Copyright 2021 - 2023
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

import { Controller } from '@nestjs/common';
import { Resolver } from 'type-graphql';
import { applyClassDecorators } from '../decorators';

export interface ApiControllerOptions {
  path?: string;
}

export const ApiController = (path?: string) => {
  return applyClassDecorators(Controller(path !== undefined ? path : ''), Resolver());
};
