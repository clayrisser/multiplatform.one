/*
 *  File: /src/bootstrap/app.ts
 *  Project: api
 *  File Created: 19-09-2023 06:04:27
 *  Author: Clay Risser
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

import 'nestjs-axios-logger/axiosInherit';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestApplicationOptions } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RegisterAppModuleConfig } from '@/app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { logLevels, registerEjs, registerLogger, registerMiscellaneous, registerSofa, registerSwagger } from './index';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const logger = new Logger('Bootstrap');
let app: NestExpressApplication;
const server = express();
const bootstrappedEvents: BootstrapEventHandler[] = [];

export async function createApp(isServer = false): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.register({ registerKeycloak: isServer }),
    new ExpressAdapter(isServer ? server : undefined),
    {
      bodyParser: true,
      bufferLogs: false,
      logger: logLevels,
    },
  );
  const config = app.get(ConfigService);
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());
  if (config.get('CORS') === '1') {
    app.enableCors({ origin: config.get('CORS_ORIGIN') || '*' });
  }
  return app;
}

export async function appListen(app: NestExpressApplication) {
  const config = app.get(ConfigService);
  const privatePort = Number(config.get('PRIVATE_PORT') || 5001);
  const publicPort = Number(config.get('PUBLIC_PORT') || 5000);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.listen(publicPort, '0.0.0.0', () => logger.log(`public listening on port ${publicPort}`)).catch(logger.error);
  await httpListen(server, privatePort, () => logger.log(`private listening on port ${privatePort}`));
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

export async function start() {
  app = await createApp();
  await app.init();
  const { schema } = app.get(GraphQLSchemaHost);
  await app.close();
  app = await createApp(true);
  await registerLogger(app);
  const sofa = await registerSofa(app, schema);
  await registerEjs(app);
  await registerSwagger(app, sofa);
  await registerMiscellaneous(app);
  const p = appListen(app);
  await emitBootstrapped(app);
  await p;
}

export async function stop() {
  if (!app) return;
  await app.close();
}

export async function restart() {
  await stop();
  await start();
}

export function onBootstrapped(eventHandler: BootstrapEventHandler) {
  bootstrappedEvents.push(eventHandler);
}

async function emitBootstrapped(app: NestExpressApplication) {
  const clonedBootstrappedEvents = [...bootstrappedEvents];
  bootstrappedEvents.splice(0, bootstrappedEvents.length);
  await new Promise((r) => setTimeout(r, 1000, null));
  clonedBootstrappedEvents.forEach((eventHandler: BootstrapEventHandler) => eventHandler(app));
}

async function httpListen(server: http.RequestListener, port: number, cb: () => void) {
  return new Promise((resolve, reject) => {
    const httpServer = http.createServer(server);
    httpServer.on('error', (err: Error) => reject(err));
    httpServer.on('close', () => resolve(undefined));
    httpServer.listen(port, () => cb());
  });
}

declare const module: any;

export type BootstrapEventHandler = (app: NestExpressApplication) => unknown;

export interface CreateAppConfig {
  nest?: NestApplicationOptions;
  appModule?: RegisterAppModuleConfig;
}
