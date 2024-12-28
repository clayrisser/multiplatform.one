/**
 * File: /src/wait.ts
 * Project: @multiplatform.one/utils
 * File Created: 28-12-2024 11:13:31
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

import axios from "axios";
import pg from "pg";

export async function waitForApi(interval: number) {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.API_PORT || "5001"}/healthz`,
    );
    if ((res?.status || 500) < 300) {
      return;
    }
  } catch (err) {}
  await new Promise((resolve) => setTimeout(resolve, interval));
  return waitForApi(interval);
}

export async function waitForFrappe(interval: number) {
  try {
    const res = await axios.get(
      `${process.env.FRAPPE_BASE_URL || "http://frappe.localhost"}/api/method/ping`,
    );
    if ((res?.status || 500) < 300) {
      return;
    }
  } catch (err) {}
  await new Promise((resolve) => setTimeout(resolve, interval));
  return waitForFrappe(interval);
}

export async function waitForPostgres(interval: number) {
  const client = new pg.Client({
    database: process.env.POSTGRES_DATABASE || "postgres",
    host: process.env.POSTGRES_HOSTNAME || "localhost",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    port: Number.parseInt(process.env.POSTGRES_PORT || "5432"),
    user: process.env.POSTGRES_USERNAME || "postgres",
  });
  try {
    await client.connect();
    while (true) {
      try {
        await client.query("SELECT 1");
        return;
      } catch (error) {}
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  } finally {
    await client.end();
  }
}

export async function waitForKeycloak(interval: number) {
  try {
    const res = await axios.get(
      `${process.env.KEYCLOAK_BASE_URL || "http://localhost:8080"}/realms/master/.well-known/openid-configuration`,
    );
    if ((res?.status || 500) < 300) {
      return;
    }
  } catch (err) {}
  await new Promise((resolve) => setTimeout(resolve, interval));
  return waitForKeycloak(interval);
}

export function formatServiceList(services: string[]): string {
  if (services.length === 1) return services[0];
  if (services.length === 2) return `${services[0]} and ${services[1]}`;
  return `${services.slice(0, -1).join(", ")} and ${services[services.length - 1]}`;
}

export const waitServices = ["api", "frappe", "postgres", "keycloak"] as const;

export type WaitService = (typeof waitServices)[number];
