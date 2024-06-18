/*
 * File: /src/types.ts
 * Project: @multiplatform.one/electron
 * File Created: 17-06-2024 07:47:50
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

export type IpcHandler<TVariables extends object = {}, TData extends object = {}> = (
  variables: TVariables,
) => TData | Promise<TData>;

export interface IpcHandlers {
  mutations?: Record<string, IpcHandler>;
  queries?: Record<string, IpcHandler>;
}

export interface IpcRequest<THandler extends string = string> {
  body?: string;
  handler: THandler;
  id: string;
  method: IpcMethod;
}

export interface IpcResponse<THandler extends string = string> {
  payload?: string;
  error?: string;
  handler: THandler;
  id: string;
  method: IpcMethod;
}

export enum IpcEvent {
  Request = 'request',
  Response = 'response',
}

export enum IpcMethod {
  Mutation = 'mutation',
  Query = 'query',
}
