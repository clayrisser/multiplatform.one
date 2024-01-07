/*
 *  File: /server.js
 *  Project: @platform/next
 *  File Created: 06-01-2024 22:25:26
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

require('reflect-metadata');
const WebSocketServer = require('ws').Server;
const buildSchema = require('type-graphql').buildSchema;
const createServer = require('http').createServer;
const createYoga = require('graphql-yoga').createYoga;
const next = require('next');
const parse = require('url').parse;
const path = require('path');
const resolvers = require('api').resolvers;
const useServer = require('graphql-ws/lib/use/ws').useServer;
const yogaServerOptions = require('api').yogaServerOptions;
const dotenv = require('dotenv');
dotenv.config();

const port = Number(process.env.PORT || 3000);
const hostname = '0.0.0.0';

const app = next({
  dev: process.argv[2] === 'dev',
  hostname,
  port,
});

const logger = console;
const graphqlEndpoint = '/graphql';

(async () => {
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: path.resolve(__dirname, 'schema.graphql'),
  });
  const yoga = createYoga({
    ...yogaServerOptions,
    graphqlEndpoint,
    graphiql: {
      subscriptionsProtocol: 'WS',
    },
    schema,
  });
  await app.prepare();
  const handle = app.getRequestHandler();
  const server = createServer(async (req, res) => {
    try {
      const url = parse(req.url, true);
      if (url.pathname && url.pathname.startsWith(graphqlEndpoint)) {
        await yoga(req, res);
      } else {
        await handle(req, res, url);
      }
    } catch (err) {
      logger.error(err);
      res.writeHead(500).end();
    }
  });
  const wsServer = new WebSocketServer({
    server,
    path: graphqlEndpoint,
  });
  useServer(
    {
      execute: (args) => args.rootValue.execute(args),
      subscribe: (args) => args.rootValue.subscribe(args),
      onSubscribe: async (ctx, message) => {
        const enveloped = yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: message.payload,
        });
        const { schema, execute, subscribe, contextFactory, parse, validate } = enveloped;
        const args = {
          schema,
          operationName: message.payload.operationName,
          document: parse(message.payload.query),
          variableValues: message.payload.variables,
          contextValue: await contextFactory(),
          rootValue: {
            execute,
            subscribe,
          },
        };
        const errors = validate(args.schema, args.document);
        if (errors.length) return errors;
        return args;
      },
    },
    wsServer,
  );
  await new Promise((resolve) => server.listen(port, () => resolve(undefined)));
  process.on('SIGINT', async () => {
    server.close();
    wsServer.close();
    process.exit();
  });
  logger.info(`
> App started!
  HTTP server running on http://${hostname}:${port}
  GraphQL WebSocket server running on ws://${hostname}:${port}${graphqlEndpoint}
`);
})();
