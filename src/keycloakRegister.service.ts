/**
 * File: /src/keycloakRegister.service.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:59
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 19-07-2021 17:10:17
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import KcAdminClient from 'keycloak-admin';
import ResourceRepresentation from 'keycloak-admin/lib/defs/resourceRepresentation';
import RoleRepresentation from 'keycloak-admin/lib/defs/roleRepresentation';
import ScopeRepresentation from 'keycloak-admin/lib/defs/scopeRepresentation';
import difference from 'lodash.difference';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Logger, Inject } from '@nestjs/common';
import { AUTHORIZED } from './decorators/authorized.decorator';
import { RESOURCE } from './decorators/resource.decorator';
import { SCOPES } from './decorators/scopes.decorator';
import {
  HashMap,
  KeycloakOptions,
  RegisterOptions,
  KEYCLOAK_OPTIONS
} from './types';

// makes registration idempotent
let registeredKeycloak = false;

export default class KeycloakRegisterService {
  private logger = new Logger(KeycloakRegisterService.name);

  private registerOptions: RegisterOptions;

  private keycloakAdmin = new KcAdminClient();

  constructor(
    @Inject(KEYCLOAK_OPTIONS) private readonly options: KeycloakOptions,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector
  ) {
    this.registerOptions = {
      roles: [],
      ...(typeof this.options.register === 'boolean'
        ? {}
        : this.options.register || {})
    };
  }

  private get canRegister() {
    return (
      !registeredKeycloak &&
      !!this.options.register &&
      this.options.adminUsername &&
      this.options.adminPassword
    );
  }

  private _idsFromClientIds: HashMap<string> = {};

  private _providers: any[] | undefined;

  private get providers(): InstanceWrapper[] {
    if (this._providers) return this._providers;
    this._providers = [
      ...this.discoveryService.getProviders(),
      ...this.discoveryService.getControllers()
    ];
    return this._providers;
  }

  private get roles() {
    return [
      ...this.providers.reduce(
        (roles: Set<string>, controller: InstanceWrapper) => {
          const methods = getMethods(controller.instance);
          const values = this.reflector.getAllAndMerge(AUTHORIZED, [
            controller.metatype,
            ...methods
          ]);
          return new Set([...roles, ...values.flat()]);
        },
        new Set()
      ),
      ...(this.registerOptions.roles || [])
    ];
  }

  private get applicationRoles() {
    return this.roles.filter((role: string) => !/^realm:/g.test(role));
  }

  private get realmRoles() {
    return this.roles
      .filter((role: string) => /^realm:/g.test(role))
      .map((role: string) => role.replace(/^realm:/g, ''));
  }

  private get resources(): HashMap<string[]> {
    return Object.entries(
      this.providers.reduce(
        (resources: HashMap<Set<string>>, controller: InstanceWrapper) => {
          const methods = getMethods(controller.instance);
          const resourceName = this.reflector.get(
            RESOURCE,
            controller.metatype
          );
          if (!resourceName) return resources;
          resources[resourceName] = new Set([
            ...(resourceName in resources ? resources[resourceName] : []),
            ...methods.reduce(
              (scopes: Set<string>, method: (...args: any[]) => any) => {
                const methodValues = this.reflector.get(SCOPES, method);
                return new Set([...scopes, ...(methodValues || [])]);
              },
              new Set()
            )
          ]);
          return resources;
        },
        {}
      )
    ).reduce(
      (
        resources: HashMap<string[]>,
        [resourceName, scopes]: [string, Set<string>]
      ) => {
        resources[resourceName] = [
          ...new Set([...(resources[resourceName] || []), ...scopes])
        ];
        return resources;
      },
      this.registerOptions.resources || {}
    );
  }

  async register(force = false) {
    if (!force && !this.canRegister) return;
    this.logger.log('registering keycloak');
    await this.initializeKeycloakAdmin();
    await this.enableAuthorization();
    await this.createRealmRoles();
    await this.createApplicationRoles();
    await this.createScopedResources();
    registeredKeycloak = true;
  }

  private async initializeKeycloakAdmin() {
    await this.keycloakAdmin.auth({
      clientId: this.options.adminClientId || 'admin-cli',
      grantType: 'password',
      password: this.options.adminPassword,
      username: this.options.adminUsername
    });
    this.keycloakAdmin.setConfig({
      realmName: this.options.realm
    });
    return this.keycloakAdmin;
  }

  private async enableAuthorization() {
    await this.keycloakAdmin!.clients.update(
      { id: await this.getIdFromClientId(this.options.clientId) },
      {
        authorizationServicesEnabled: true,
        clientId: this.options.clientId,
        serviceAccountsEnabled: true
      }
    );
  }

  private async createApplicationRoles() {
    const applicationRoles = (
      await this.keycloakAdmin!.clients.listRoles({
        id: await this.getIdFromClientId(this.options.clientId)
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
          name: role
        })
      )
    );
  }

  private async createRealmRoles() {
    const realmRoles = (await this.keycloakAdmin!.roles.find()).reduce(
      (roles: string[], { name }: RoleRepresentation) => {
        if (name) roles.push(name);
        return roles;
      },
      []
    );
    const rolesToCreate = difference(this.realmRoles, realmRoles);
    await Promise.all(
      rolesToCreate.map(async (role: string) =>
        this.keycloakAdmin!.roles.create({ name: role })
      )
    );
  }

  private async createScopedResources() {
    const resources = await this.getResources();
    await Promise.all(
      Object.keys(this.resources).map(async (resourceName: string) => {
        const resource = resources.find(
          (resource: ResourceRepresentation) => resource.name === resourceName
        );
        const scopes = this.resources[resourceName];
        const existingScopes = await this.getScopes(
          // resource.id is resource._id
          // @ts-ignore
          resource?.id || resource?._id,
          scopes
        );
        const createdScopes = await this.createScopes(scopes, existingScopes);
        if (resource) {
          this.updateResource(resource, [...existingScopes, ...createdScopes]);
        } else {
          await this.createResource(resourceName, [
            ...existingScopes,
            ...createdScopes
          ]);
        }
      })
    );
  }

  private async getIdFromClientId(clientId: string) {
    if (this._idsFromClientIds[clientId]) {
      return this._idsFromClientIds[clientId];
    }
    const idFromClientId = (
      await this.keycloakAdmin!.clients.find({ clientId })
    )?.[0].id;
    if (!idFromClientId) {
      throw new Error(`could not find id from clientId '${clientId}'`);
    }
    this._idsFromClientIds[clientId] = idFromClientId;
    return idFromClientId;
  }

  private async createScopes(
    scopes: string[],
    existingScopes: ScopeRepresentation[] = []
  ): Promise<ScopeRepresentation[]> {
    const scopesToCreate = difference(
      scopes,
      existingScopes.reduce(
        (scopeNames: string[], scope: ScopeRepresentation) => {
          if (scope.name) scopeNames.push(scope.name);
          return scopeNames;
        },
        []
      )
    );
    const createdScopes: ScopeRepresentation[] = [];
    await Promise.all(
      scopesToCreate.map(async (scopeName: string) => {
        const scope = await this.createScope(scopeName);
        if (scope) createdScopes.push(scope);
      })
    );
    return createdScopes;
  }

  private async getResources(): Promise<ResourceRepresentation[]> {
    // cannot have property 'name' to list all resource
    // @ts-ignore
    return this.keycloakAdmin.clients.listResources({
      id: await this.getIdFromClientId(this.options.clientId)
    });
  }

  private async createResource(
    resourceName: string,
    scopes: ScopeRepresentation[] = []
  ): Promise<ResourceRepresentation> {
    return this.keycloakAdmin!.clients.createResource(
      {
        id: await this.getIdFromClientId(this.options.clientId)
      },
      {
        attributes: {},
        displayName: resourceName,
        name: resourceName,
        scopes
      }
    );
  }

  private async updateResource(
    resource: ResourceRepresentation,
    scopes: ScopeRepresentation[]
  ) {
    return this.keycloakAdmin!.clients.updateResource(
      {
        id: await this.getIdFromClientId(this.options.clientId),
        // resource.id is resource._id
        // @ts-ignore
        resourceId: resource.id || resource._id || ''
      },
      {
        attributes: {},
        displayName: resource?.name,
        id: resource?.id,
        name: resource?.name,
        ownerManagedAccess: false,
        scopes
      }
    );
  }

  private async getScopes(
    resourceId?: string,
    scopeNames?: string[]
  ): Promise<ScopeRepresentation[]> {
    let scopes: ScopeRepresentation[] = [];
    if (resourceId) {
      scopes = await this.keycloakAdmin!.clients.listScopesByResource({
        id: await this.getIdFromClientId(this.options.clientId),
        // resourceName is actually the resource id
        resourceName: resourceId
      });
    } else {
      scopes = await this.keycloakAdmin!.clients.listAllScopes({
        id: await this.getIdFromClientId(this.options.clientId)
      });
    }
    if (scopeNames) {
      const scopeNamesSet = new Set(scopeNames);
      return scopes.reduce(
        (scopes: ScopeRepresentation[], scope: ScopeRepresentation) => {
          if (scope.name && scopeNamesSet.has(scope.name)) scopes.push(scope);
          return scopes;
        },
        []
      );
    }
    return scopes;
  }

  private async createScope(scope: string) {
    return this.keycloakAdmin!.clients.createAuthorizationScope(
      {
        id: await this.getIdFromClientId(this.options.clientId)
      },
      {
        name: scope
      }
    );
  }
}

function getMethods(obj: any): ((...args: any[]) => any)[] {
  const propertyNames = new Set<string>();
  let current = obj;
  do {
    Object.getOwnPropertyNames(current).map((propertyName) =>
      propertyNames.add(propertyName)
    );
    // eslint-disable-next-line no-cond-assign
  } while ((current = Object.getPrototypeOf(current)));
  return [...propertyNames]
    .filter((propertyName: string) => typeof obj[propertyName] === 'function')
    .map((propertyName: string) => obj[propertyName]) as ((
    ...args: any[]
  ) => any)[];
}
