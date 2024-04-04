import path from 'path';
import { buildSchema } from '@multiplatform.one/typegraphql';
import { options } from './server';

buildSchema(options, path.resolve(__dirname, '../../gql/generated/schema.graphql'));
