/*
 *  File: /src/register.ts
 *  Project: @multiplatform.one/keycloak-typegraphql
 *  File Created: 13-01-2024 07:48:25
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

import KeycloakAdmin from '@keycloak/keycloak-admin-client';
import difference from 'lodash.difference';
import type ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import type ResourceRepresentation from '@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation';
import type RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import type ScopeRepresentation from '@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation';
import type { KeycloakOptions, RegisterOptions } from './types';
import { AUTHORIZED, RESOURCE, SCOPES } from './decorators/';
import { getMetadata, Resolvers } from '@multiplatform.one/typegraphql';

// makes registration idempotent
let registeredKeycloak = false;

export class RegisterKeycloak {
  private logger = console;

  private registerOptions: RegisterOptions;

  private keycloakAdmin?: KeycloakAdmin;

  private _idsFromClientIds: Record<string, string> = {};

  private _roles: string[] | undefined;

  constructor(
    private readonly options: KeycloakOptions,
    private readonly resolvers: Resolvers,
  ) {
    this.registerOptions = {
      roles: [],
      ...(typeof this.options.register === 'boolean' ? {} : this.options.register || {}),
    };
  }

  private get canRegister() {
    return !registeredKeycloak && !!this.options.register && this.options.adminUsername && this.options.adminPassword;
  }

  private get roles() {
    if (this._roles) return this._roles;
    this._roles = [
      ...(this.resolvers as Function[]).reduce((roles: Set<string>, resolver: Function) => {
        return new Set([
          ...roles,
          ...(getMethods(resolver)
            .map((method: Function) => {
              return getMetadata<string | string[]>(AUTHORIZED, method);
            })
            .filter(Boolean)
            .flat(Infinity) as string[]),
        ]);
      }, new Set()),
      ...(this.registerOptions.roles || []),
    ];
    return this._roles;
  }

  private get applicationRoles() {
    return this.roles.filter((role: string) => !/^realm:/g.test(role));
  }

  private get realmRoles() {
    return this.roles
      .filter((role: string) => /^realm:/g.test(role))
      .map((role: string) => role.replace(/^realm:/g, ''));
  }

  private get resources(): Record<string, string[]> {
    return Object.entries(
      (this.resolvers as Function[]).reduce((resources: Record<string, Set<string>>, resolver: Function) => {
        const methods = getMethods(resolver);
        const resourceName = getMetadata(RESOURCE, resolver);
        if (!resourceName) return resources;
        resources[resourceName] = new Set([
          ...(resourceName in resources ? resources[resourceName] : []),
          ...methods.reduce((scopes: Set<string>, method: (...args: any[]) => any) => {
            const methodValues = getMetadata(SCOPES, method);
            return new Set([...scopes, ...(methodValues || [])]);
          }, new Set()),
        ]);
        return resources;
      }, {}),
    ).reduce((resources: Record<string, string[]>, [resourceName, scopes]: [string, Set<string>]) => {
      resources[resourceName] = [...new Set([...(resources[resourceName] || []), ...scopes])];
      return resources;
    }, this.registerOptions.resources || {});
  }

  async register(force = false) {
    if (!force && !this.canRegister) return;
    await this.initializeKeycloakAdmin();
    const client = await this.getClient();
    await this.createRealmRoles();
    if (await this.canEnableAuthorization(client)) {
      await this.enableAuthorization(client);
      await this.createApplicationRoles();
      await this.createScopedResources();
    }
    registeredKeycloak = true;
  }

  private async initializeKeycloakAdmin() {
    if (!this.keycloakAdmin) this.keycloakAdmin = new KeycloakAdmin({ baseUrl: this.options.baseUrl });
    await this.keycloakAdmin.auth({
      clientId: this.options.adminClientId || 'admin-cli',
      grantType: 'password',
      password: this.options.adminPassword,
      username: this.options.adminUsername,
    });
    this.keycloakAdmin.setConfig({
      realmName: this.options.realm,
    });
    return this.keycloakAdmin;
  }

  private async getClient() {
    const client = await this.keycloakAdmin!.clients.findOne({
      id: await this.getIdFromClientId(this.options.clientId),
    });
    if (!client) {
      throw new Error(`client ${this.options.clientId} does not exist in the ${this.options.realm} realm`);
    }
    return client;
  }

  private async canEnableAuthorization(client: ClientRepresentation) {
    if (client?.publicClient) {
      this.logger.warn({ clientId: this.options.clientId }, 'authorization cannot be enabled on a public client');
      return false;
    }
    return true;
  }

  private async enableAuthorization(client: ClientRepresentation) {
    if (!client?.serviceAccountsEnabled || !client.authorizationServicesEnabled) {
      await this.keycloakAdmin!.clients.update(
        { id: await this.getIdFromClientId(this.options.clientId) },
        {
          authorizationServicesEnabled: true,
          clientId: this.options.clientId,
          serviceAccountsEnabled: true,
        },
      );
    }
  }

  private async createApplicationRoles() {
    const applicationRoles = (
      await this.keycloakAdmin!.clients.listRoles({
        id: await this.getIdFromClientId(this.options.clientId),
      })
    ).reduce((roles: string[], { name }: RoleRepresentation) => {
      if (name) roles.push(name);
      return roles;
    }, []);
    const rolesToCreate = difference(this.applicationRoles, applicationRoles);
    await Promise.all(
      rolesToCreate.map(async (role: string) =>
        this.keycloakAdmin!.clients.createRole({
          id: await this.getIdFromClientId(this.options.clientId),
          name: role,
        }),
      ),
    );
  }

  private async createRealmRoles() {
    const realmRoles = (await this.keycloakAdmin!.roles.find()).reduce(
      (roles: string[], { name }: RoleRepresentation) => {
        if (name) roles.push(name);
        return roles;
      },
      [],
    );
    const rolesToCreate = difference(this.realmRoles, realmRoles);
    await Promise.all(rolesToCreate.map(async (role: string) => this.keycloakAdmin!.roles.create({ name: role })));
  }

  private async createScopedResources() {
    const resources = await this.getResources();
    await Promise.all(
      Object.keys(this.resources).map(async (resourceName: string) => {
        const resource = resources.find((resource: ResourceRepresentation) => resource.name === resourceName);
        const scopes = this.resources[resourceName];
        const existingScopes = await this.getScopes(
          // resource.id is resource._id
          // @ts-ignore
          resource?.id || resource?._id,
          scopes,
        );
        const createdScopes = await this.createScopes(scopes, existingScopes);
        if (resource) {
          this.updateResource(resource, [...existingScopes, ...createdScopes]);
        } else {
          await this.createResource(resourceName, [...existingScopes, ...createdScopes]);
        }
      }),
    );
  }

  private async getIdFromClientId(clientId: string) {
    if (this._idsFromClientIds[clientId]) return this._idsFromClientIds[clientId];
    const idFromClientId = (await this.keycloakAdmin!.clients.find({ clientId }))?.[0]?.id;
    if (!idFromClientId) {
      throw new Error(`client ${this.options.clientId} does not exist in the ${this.options.realm} realm`);
    }
    this._idsFromClientIds[clientId] = idFromClientId;
    return idFromClientId;
  }

  private async createScopes(
    scopes: string[],
    existingScopes: ScopeRepresentation[] = [],
  ): Promise<ScopeRepresentation[]> {
    const scopesToCreate = difference(
      scopes,
      existingScopes.reduce((scopeNames: string[], scope: ScopeRepresentation) => {
        if (scope.name) scopeNames.push(scope.name);
        return scopeNames;
      }, []),
    );
    const createdScopes: ScopeRepresentation[] = [];
    await Promise.all(
      scopesToCreate.map(async (scopeName: string) => {
        const scope = await this.createScope(scopeName);
        if (scope) createdScopes.push(scope);
      }),
    );
    return createdScopes;
  }

  private async getResources(): Promise<ResourceRepresentation[]> {
    // cannot have property 'name' to list all resource
    // @ts-ignore
    return this.keycloakAdmin.clients.listResources({
      id: await this.getIdFromClientId(this.options.clientId),
    });
  }

  private async createResource(
    resourceName: string,
    scopes: ScopeRepresentation[] = [],
  ): Promise<ResourceRepresentation> {
    return this.keycloakAdmin!.clients.createResource(
      {
        id: await this.getIdFromClientId(this.options.clientId),
      },
      {
        attributes: {},
        displayName: resourceName,
        name: resourceName,
        scopes,
      },
    );
  }

  private async updateResource(resource: ResourceRepresentation, scopes: ScopeRepresentation[]) {
    return this.keycloakAdmin!.clients.updateResource(
      {
        id: await this.getIdFromClientId(this.options.clientId),
        // resource.id is resource._id
        // @ts-ignore
        resourceId: resource.id || resource._id || '',
      },
      {
        attributes: {},
        displayName: resource?.name,
        name: resource?.name,
        ownerManagedAccess: false,
        scopes,
        // TODO: probably can remove the following
        ...((resource as unknown as any)?.id
          ? {
              id: (resource as unknown as any)?.id,
            }
          : {}),
      },
    );
  }

  private async getScopes(resourceId?: string, scopeNames?: string[]): Promise<ScopeRepresentation[]> {
    let scopes: ScopeRepresentation[] = [];
    if (resourceId) {
      scopes = await this.keycloakAdmin!.clients.listScopesByResource({
        id: await this.getIdFromClientId(this.options.clientId),
        // resourceName is actually the resource id
        resourceName: resourceId,
      });
    } else {
      scopes = await this.keycloakAdmin!.clients.listAllScopes({
        id: await this.getIdFromClientId(this.options.clientId),
      });
    }
    if (scopeNames) {
      const scopeNamesSet = new Set(scopeNames);
      return scopes.reduce((scopes: ScopeRepresentation[], scope: ScopeRepresentation) => {
        if (scope.name && scopeNamesSet.has(scope.name)) scopes.push(scope);
        return scopes;
      }, []);
    }
    return scopes;
  }

  private async createScope(scope: string) {
    return this.keycloakAdmin!.clients.createAuthorizationScope(
      {
        id: await this.getIdFromClientId(this.options.clientId),
      },
      {
        name: scope,
      },
    );
  }
}

function getMethods(obj: Function): ((...args: any[]) => any)[] {
  const propertyNames = new Set<string>();
  let current = obj.prototype;
  do {
    Object.getOwnPropertyNames(current).map((propertyName) => propertyNames.add(propertyName));
  } while ((current = Object.getPrototypeOf(current)));
  return [...propertyNames]
    .filter((propertyName: string) => typeof obj.prototype[propertyName] === 'function')
    .map((propertyName: string) => obj.prototype[propertyName]) as ((...args: any[]) => any)[];
}
