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

export interface IpcRequest<THandler extends string = string, TVariables extends object = {}> {
  handler: THandler;
  id: string;
  method: IpcMethod;
  variables?: TVariables;
}

export interface IpcResponse<THandler extends string = string, TData = any, TError = Error> {
  data?: TData;
  error?: TError;
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
