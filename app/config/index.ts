import { Config } from 'multiplatform.one';

export const config = new Config({
  ...require('./public'),
  ...require('./private'),
});
