/*
 * File: /src/utils.ts
 * Project: @multiplatform.one/typegraphql
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

import startCase from 'lodash.startcase';
import { randomUUID } from 'crypto';

export function getReqHeader(req: any, name: string, headers: Record<string, string> = {}) {
  headers = Object.entries(headers).reduce(
    (headers, [key, value]: [string, string]) => {
      headers[key.toLowerCase()] = value;
      return headers;
    },
    {} as Record<string, string>,
  );
  name = name.toLowerCase();
  let header: string | string[] | undefined;
  if (typeof req?.headers?.get === 'function') {
    header = req.headers.get(name);
  }
  if (!header && typeof req?.get === 'function') {
    header = req.headers.get(name);
  }
  if (!header && req.headers) header = req.headers?.[name];
  if (!header) {
    header = headers[name];
  }
  if (Array.isArray(header)) return header.join(', ');
  return (header as string) || undefined;
}

export function setResHeader(res: any, name: string, value: string) {
  name = startCase(name).replace(/\s/g, '-');
  if (typeof res?.headers?.set === 'function') {
    res.headers.set(name, value);
  } else if (typeof res?.setHeader === 'function') {
    res.setHeader(name, value);
  } else if (typeof res?.set === 'function') {
    res.set(name, value);
  } else if (typeof res?.headers === 'object') {
    res.headers[name] = value;
  }
}

export function generateRequestId(req: any, res: any): string {
  if ((req as any).requestId) return (req as any).requestId;
  const requestId =
    (req as any).requestId || typeof req.id === 'string' ? req.id : getReqHeader(req, 'X-Request-Id') || randomUUID();
  (req as any).requestId = requestId;
  setResHeader(res, 'X-Request-Id', requestId);
  return requestId;
}
