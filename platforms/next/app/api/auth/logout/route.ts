import { createLogoutHandler } from '@multiplatform.one/keycloak/routes';
import { authOptions } from '../../../../authOptions';

const { GET } = createLogoutHandler(authOptions);

export { GET };
