/*
 * File: /src/pubSub.ts
 * Project: @multiplatform.one/typegraphql
 * File Created: 07-06-2024 15:22:52
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

import type {
  ChannelPubSubConfig,
  PubSub,
} from "@graphql-yoga/subscription/typings/create-pub-sub";
import { Repeater } from "@repeaterjs/repeater";
import type { ClientConfig as PgClientConfig } from "pg";
import PGPubSub from "pg-pubsub";

interface PubSubPublishArgsByKey {
  [key: string]: [] | [any] | [number | string, any];
}

export interface CreatePgPubSubConfig<
  TPubSubPublishArgsByKey extends PubSubPublishArgsByKey,
> extends Omit<ChannelPubSubConfig<TPubSubPublishArgsByKey>, "eventTarget">,
    PgClientConfig {}

export function createPgPubSub<
  TPubSubPublishArgsByKey extends PubSubPublishArgsByKey,
>({
  ...pgConfig
}: CreatePgPubSubConfig<TPubSubPublishArgsByKey>): PubSub<TPubSubPublishArgsByKey> {
  const pgPubSub = new PGPubSub(pgConfig);
  return {
    async publish<TKey extends Extract<keyof TPubSubPublishArgsByKey, string>>(
      routingKey: TKey,
      ...args: TPubSubPublishArgsByKey[TKey]
    ) {
      const payload = args[1] ?? args[0] ?? null;
      const topic =
        args[1] === undefined
          ? routingKey
          : `${routingKey}:${args[0] as number}`;
      await pgPubSub.publish(topic, { payload });
    },

    subscribe<TKey extends Extract<keyof TPubSubPublishArgsByKey, string>>(
      ...[routingKey, id]: TPubSubPublishArgsByKey[TKey][1] extends undefined
        ? [TKey]
        : [TKey, TPubSubPublishArgsByKey[TKey][0]]
    ): Repeater<
      TPubSubPublishArgsByKey[TKey][1] extends undefined
        ? TPubSubPublishArgsByKey[TKey][0]
        : TPubSubPublishArgsByKey[TKey][1]
    > {
      const topic =
        id === undefined ? routingKey : `${routingKey}:${id as number}`;
      return new Repeater(async (next, stop) => {
        await pgPubSub.addChannel(topic, (data) => {
          next(data.payload);
        });
        stop.then(() => {
          pgPubSub.removeChannel(topic);
        });
      });
    },
  };
}
