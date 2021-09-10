# nestjs-keycloak

[![GitHub stars](https://img.shields.io/github/stars/silicon-hills/nestjs-keycloak.svg?style=social&label=Stars)](https://github.com/silicon-hills/nestjs-keycloak)

> nestjs module for authenticating keycloak

Please ★ this repo if you found it useful ★ ★ ★

What sets this apart from projects such as [nest-keycloak-connect](https://www.npmjs.com/package/nest-keycloak-connect) is
the several awesome enhancements as well as support for [TypeGraphQL](https://typegraphql.com) using [nestjs-keycloak-typegraphql](https://www.npmjs.com/package/nestjs-keycloak-typegraphql).
This makes it possible to use this with projects such as [typegraphql-nestjs](https://www.npmjs.com/package/typegraphql-nestjs)
and [typegraphql-prisma](https://www.npmjs.com/package/typegraphql-prisma).

There are several key decisions in the architecture that differ from [nest-keycloak-connect](https://www.npmjs.com/package/nest-keycloak-connect). Most of these decisions were made to increase compatibility with [TypeGraphQL](https://typegraphql.com). The most obvious difference is that all
the controllers and resolvers are public by default, unless a decorator explicitly annotates a class or method. Another key difference is that
the `@Roles()` decorator is replaced with [`@Authorized()`](src/decorators/authorized.decorator.ts). It works basically the same way as the
TypeGraphQL `@Authorized()` decorator.

[src/decorators/authorized.decorator.ts](src/decorators/authorized.decorator.ts)

[https://typegraphql.com/docs/authorization.html](https://typegraphql.com/docs/authorization.html)

There are also some enhancements such as the ability to use a union or intersection of roles.

Another key enhancement is the automatic registration of resources, roles and scopes with KeyCloak during the bootstrapping of the application.

https://github.com/silicon-hills/nestjs-keycloak/blob/main/src/keycloakRegister.service.ts#L170

## Installation

```sh
npm install --save nestjs-keycloak
```

## Support

Submit an [issue](https://github.com/silicon-hills/nestjs-keycloak/issues/new)

## Usage

Here is a basic example of how to use this.

```ts
import KeycloakModule from 'nestjs-keycloak';
```

```ts
KeycloakModule.registerAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return {
      adminClientId: config.get('KEYCLOAK_ADMIN_CLIENT_ID') || '',
      adminPassword: config.get('KEYCLOAK_ADMIN_PASSWORD') || '',
      adminUsername: config.get('KEYCLOAK_ADMIN_USERNAME') || '',
      baseUrl: config.get('KEYCLOAK_BASE_URL') || '',
      clientId: config.get('KEYCLOAK_CLIENT_ID') || '',
      clientSecret: config.get('KEYCLOAK_CLIENT_SECRET') || '',
      realm: config.get('KEYCLOAK_REALM') || '',
      register: {
        resources: {},
        roles: []
      }
    };
  }
});
```

### Unions and Intersections

You can specify a union of roles by using an array. The following example
means a user must have the roles `one`, `two` and `three`.

```ts
@Authorized(['one', 'two', 'three'])
@Get('cats')
getCats() {
  return ['calico']
}
```

You can specify an intersection of roles as well. The following example
means a user must have at least the role `one`, `two` or `three`.

```ts
@Authorized('one', 'two', 'three')
@Get('cats')
getCats() {
  return ['calico']
}
```

You can use unions and intersections together. The following example
means a user must have at least the roles `one` and `two` or the role `three`.

```ts
@Authorized(['one', 'two'], 'three')
@Get('cats')
getCats() {
  return ['calico']
}
```

### Realm Roles

If you want to support a realm role, instead of a client role, simply prepend `realm:`
to the beginning of the role name. For example the following would only allow users
with the realm role `admin` to be able to access the respective resolver or controller.

```ts
@Authorized('realm:admin')
@Get('cats')
getCats() {
  return ['calico']
}
```

### TypeGraphQL

If you also want to add typegraphql support, you can add the following . . .

```ts
import KeycloakTypegraphql from 'nestjs-keycloak-typegraphql';
```

```ts
KeycloakTypegraphql.register({});
```

### Decorators

https://github.com/silicon-hills/nestjs-keycloak/tree/main/src/decorators

### KeyCloak Registration

One of the really cool things about this project is the automatic registration of
roles, resources and scopes with keycloak. This will only work if you provide
the `adminUser` and `adminPassword` configuration.

If you want to log the registration api calls to KeyCloak during the application bootstrap, you can setup
[nestjs-axios-logger](https://www.npmjs.com/package/nestjs-axios-logger) as demonstrated below.

### KeyCloak Service

The keycloak service provides a ton of awesome utility methods. Here are just a few
of them.

`await keycloakService.getAccessToken()` gets the access token and automatically renews it
with the refresh token if it finds it was expired.

`await keycloakService.getUser()` gets the keycloak user from the keycloak server. This will
include all the information about the user including their custom properties. This will only
work if the `adminUser` and `adminPassword` settings are configured. If you are trying
to get information about the user that is contained in the token, it is better to directly
get the information from the token rather then using this method because it makes an api
call to the keycloak server.

`await keycloakService.getUserInfo()` gets the user info from the access token. It is better
to use this method instead of `getUser()` when trying to access information such as the username
or email, because it does not require `adminUser` or `adminPassword` settings configured and because
it does not make an api call to the server.

You can find all of the available methods at the link below.

https://github.com/silicon-hills/nestjs-keycloak/blob/main/src/keycloak.service.ts

### Example

You can find a full example at the link below.

https://github.com/clayrisser/nestjs-example/blob/main/src/app.ts

## License

[Apache-2.0 License](LICENSE)

[Silicon Hills LLC](https://siliconhills.dev) © 2021

## Credits

- [Clay Risser](https://clayrisser.com) - Author
