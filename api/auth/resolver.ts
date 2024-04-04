import { Authorized, InjectAccessToken, InjectUsername, InjectUserId } from '@multiplatform.one/keycloak-typegraphql';
import { Query, Resolver } from 'type-graphql';

@Authorized()
@Resolver((_of) => String)
export class AuthResolver {
  @Query((_returns) => String)
  async accessToken(@InjectAccessToken() accessToken: string): Promise<string> {
    return accessToken;
  }

  @Query((_returns) => String)
  username(@InjectUsername() username: string): string {
    return username;
  }

  @Query((_returns) => String)
  userId(@InjectUserId() userId: string): string {
    return userId;
  }
}
