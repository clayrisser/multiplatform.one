import { authHandlerOptions } from '../../../../authOptions';
import { createAuthHandler } from '@multiplatform.one/keycloak/routes';

const handler = createAuthHandler(authHandlerOptions);

export { handler as GET, handler as POST };
