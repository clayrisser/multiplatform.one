/*
 *  File: /src/tracing.ts
 *  Project: @multiplatform.one/typegraphql
 *  File Created: 17-01-2024 09:41:00
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
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

import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { CompositePropagator, W3CTraceContextPropagator, W3CBaggagePropagator } from '@opentelemetry/core';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

process.env.OTEL_EXPORTER_JAEGER_ENDPOINT = process.env.OTEL_EXPORTER_TRACE_ENDPOINT;

export const otelSDK = new NodeSDK({
  metricReader:
    process.env.OTEL_EXPORTER_PROMETHEUS_ENABLED === '1'
      ? new PrometheusExporter({
          port: 8081,
        })
      : undefined,
  spanProcessor:
    process.env.OTEL_EXPORTER_TRACE_ENABLED === '1' && process.env.OTEL_EXPORTER_TRACE_ENDPOINT
      ? new SimpleSpanProcessor(new JaegerExporter())
      : undefined,
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  instrumentations: [getNodeAutoInstrumentations(), new PrismaInstrumentation()],
});
