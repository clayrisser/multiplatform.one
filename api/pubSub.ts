/*
 *  File: /pubSub.ts
 *  Project: api
 *  File Created: 19-01-2024 11:36:19
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2024
 *
 *  Licensed under the GNU Affero General Public License (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/agpl-3.0.en.html
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  You can be released from the requirements of the license by purchasing
 *  a commercial license. Buying such a license is mandatory as soon as you
 *  develop commercial activities involving this software without disclosing
 *  the source code of your own applications.
 */

import { createPgPubSub } from '@multiplatform.one/typegraphql';

export const PING_PONG_EVENTS = 'PING_PONG_EVENTS';

export interface PubSubEvents {
  [key: string]: any;
  [PING_PONG_EVENTS]: [number];
}

export const pubSub = createPgPubSub<PubSubEvents>({
  database: process.env.POSTGRES_DATABASE || 'postgres',
  host: process.env.POSTGRES_HOSTNAME || 'localhost',
  password: process.env.POSTGRES_PASSWORD || '',
  port: parseInt(process.env.POSTGRES_PORT || '', 10) || 5432,
  user: process.env.POSTGRES_USERNAME || 'postgres',
});
