/*
 * File: /src/background.ts
 * Project: @multiplatform.one/electron
 * File Created: 17-06-2024 07:46:50
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

import { ipcMain } from "electron";
import type { IpcHandlers, IpcRequest, IpcResponse } from "./types";
import { IpcEvent, IpcMethod } from "./types";

const logger = console;

export function createIpcHandler<
  THandler extends string = string,
  TVariables extends object = {},
  TData = any,
>(
  method: IpcMethod,
  handler: string,
  handlerFn: (variables: TVariables) => TData | Promise<TData>,
) {
  return () => {
    ipcMain.on(
      IpcEvent.Request,
      async (event, request: IpcRequest<THandler>) => {
        if (
          request.handler !== handler ||
          request.method !== method ||
          !request.id
        )
          return;
        try {
          const response: IpcResponse<THandler> = {
            handler: request.handler,
            id: request.id,
            method: request.method,
            payload: JSON.stringify(
              await handlerFn(JSON.parse(request.body || "{}")),
            ),
          };
          event.reply(IpcEvent.Response, response);
        } catch (err) {
          logger.error(err);
          const response: IpcResponse<THandler> = {
            error: err?.message || err.toString(),
            handler: request.handler,
            id: request.id,
            method: request.method,
          };
          event.reply(IpcEvent.Response, response);
        }
      },
    );
  };
}

export function createIpcHandlers(handlers: IpcHandlers) {
  return () => {
    Object.entries(handlers.mutations || {}).forEach(([key, handler]) => {
      createIpcHandler(IpcMethod.Mutation, key, handler)();
    });
    Object.entries(handlers.queries || {}).forEach(([key, handler]) => {
      createIpcHandler(IpcMethod.Query, key, handler)();
    });
  };
}

export * from "./types";
