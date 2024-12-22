/*
 * File: /src/logger/context.ts
 * Project: @multiplatform.one/typegraphql
 * File Created: 22-12-2024 07:18:06
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

import { context, trace } from "@opentelemetry/api";
import type { Logger } from "multiplatform.one";

export function createContextLogger(
  logger: Logger,
  context: Record<string, any>,
): Logger {
  const telemetryContext = getOpenTelemetryContext();
  return logger.child({
    ...context,
    ...telemetryContext,
  });
}

export function getOpenTelemetryContext(): Record<string, any> {
  const span = trace.getSpan(context.active());
  if (!span) return {};
  const spanContext = span.spanContext();
  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
    traceFlags: spanContext.traceFlags,
  };
}
