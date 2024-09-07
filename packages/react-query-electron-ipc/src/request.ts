/*
 * File: /src/request.ts
 * Project: @multiplatform.one/prisma-scripts
 * File Created: 04-04-2024 15:50:39
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

import type { EventEmitter } from "node:stream";
import { v4 as uuid } from "uuid";
import type { IpcRequest, IpcResponse } from "./types";
import { IpcEvent, IpcMethod } from "./types";

export interface IpcRequestOptions {
  timeout?: number;
}

async function ipcRequest<
  THandler extends string = string,
  TVariables extends object = {},
  TData extends object = {},
>(
  method: IpcMethod,
  handler: THandler,
  variables: TVariables,
  options?: IpcRequestOptions,
): Promise<TData> {
  return new Promise((resolve, reject) => {
    const id = uuid();
    let clearListener: () => void = () => {};
    function listener(response: IpcResponse<THandler>) {
      if (
        response.id !== id ||
        response.handler !== handler ||
        response.method !== method
      )
        return;
      clearListener();
      if (response.error) return reject(new Error(response.error));
      return resolve(JSON.parse(response.payload || "{}"));
    }
    clearListener = window.ipc.on(IpcEvent.Response, listener);
    window.ipc.send(IpcEvent.Request, {
      handler,
      body: JSON.stringify(variables),
      id,
      method,
    });
    if (options?.timeout) {
      setTimeout(() => {
        clearListener();
        reject(
          new Error(
            `ipc request handler ${handler} timed out after ${options.timeout}ms`,
          ),
        );
      }, options.timeout);
    }
  });
}

export async function ipcMutation<
  THandler extends string = string,
  TVariables extends object = {},
  TData extends object = {},
>(
  handler: THandler,
  variables?: TVariables,
  options?: IpcRequestOptions,
): Promise<TData> {
  return ipcRequest<THandler, TVariables, TData>(
    IpcMethod.Mutation,
    handler,
    variables,
    options,
  );
}

export async function ipcQuery<
  THandler extends string = string,
  TVariables extends object = {},
  TData extends object = {},
>(
  handler: THandler,
  variables?: TVariables,
  options?: IpcRequestOptions,
): Promise<TData> {
  return ipcRequest<THandler, TVariables, TData>(
    IpcMethod.Query,
    handler,
    variables,
    options,
  );
}

declare global {
  interface Window {
    ipc: {
      send: <THandler extends string = string>(
        channel: string,
        request: IpcRequest<THandler>,
      ) => void;
      on: (event: string, listener: (...args: any[]) => void) => () => void;
    };
  }
}
