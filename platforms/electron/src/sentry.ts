/*
 * File: /src/sentry.ts
 * Project: @platform/electron
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

import * as Sentry from "@sentry/electron/main";
import type { Event } from "@sentry/types";

export function initializeSentry(processType: "main" | "renderer") {
  const SentryModule =
    processType === "main"
      ? require("@sentry/electron/main")
      : require("@sentry/electron/renderer");

  SentryModule.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    release: process.env.npm_package_version,
    debug: process.env.NODE_ENV === "development",
    beforeSend(event: Event) {
      // You can modify the event here or prevent it from being sent
      return event;
    },
  });
}

// Add context information to Sentry
export function addSentryContext(
  key: string,
  value: Record<string, any> | string | number | boolean,
) {
  const SentryModule = require("@sentry/electron/main");
  if (typeof value === "object") {
    SentryModule.setContext(key, value);
  } else {
    SentryModule.setTag(key, String(value));
  }
}

// Export Sentry for direct access if needed
export { Sentry };
