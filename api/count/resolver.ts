import { Authorized } from '@multiplatform.one/keycloak-typegraphql';
import { CountService } from './service';
import { Resolver, Subscription, Root, Query } from 'type-graphql';
import { Injectable } from '@multiplatform.one/typegraphql';

@Authorized()
@Injectable()
@Resolver((_of) => String)
export class CountResolver {
  constructor(private readonly countService: CountService) {}

  @Subscription(() => Number, {
    async *subscribe() {
      let count = 0;
      for (let i = 0; i < 99; i++) {
        ++count;
        yield count;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    },
  })
  count(@Root() payload: number): number {
    return payload;
  }

  @Query(() => String)
  async hello() {
    return this.countService.hello();
  }
}
