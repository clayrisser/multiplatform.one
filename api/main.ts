import { createServer } from '@multiplatform.one/typegraphql';
import { options } from './server';

(async () => {
  const server = await createServer(options);
  await server.start();
})();
