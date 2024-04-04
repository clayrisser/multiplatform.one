import { AuthResolver } from './auth';
import { CountResolver } from './count';
import { Authorized } from '@multiplatform.one/keycloak-typegraphql';
import { NonEmptyArray } from 'type-graphql';
import {
  PostCrudResolver,
  UserCrudResolver,
  applyArgsTypesEnhanceMap,
  applyInputTypesEnhanceMap,
  applyModelsEnhanceMap,
  applyOutputTypesEnhanceMap,
  applyRelationResolversEnhanceMap,
  applyResolversEnhanceMap,
} from './generated/type-graphql';

export const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
  AuthResolver,
  CountResolver,
  PostCrudResolver,
  UserCrudResolver,
];

applyResolversEnhanceMap({
  User: {
    _all: [Authorized()],
  },
});
applyArgsTypesEnhanceMap({});
applyInputTypesEnhanceMap({});
applyModelsEnhanceMap({});
applyOutputTypesEnhanceMap({});
applyRelationResolversEnhanceMap({});
