/**
 * File: /src/keycloakRegister.service.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:59
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 19-07-2021 02:13:33
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
import { HttpService } from '@nestjs/axios';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Logger, Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AUTHORIZED } from './decorators/authorized.decorator';
import { RESOURCE } from './decorators/resource.decorator';
import { SCOPES } from './decorators/scopes.decorator';
import {
  HashMap,
  KeycloakOptions,
  RegisterOptions,
  KEYCLOAK_OPTIONS
} from './types';

export default class KeycloakRegisterService {
  private logger = new Logger(KeycloakRegisterService.name);

  private registerOptions: RegisterOptions;

  private kcAdminClient = new KcAdminClient();

  constructor(
    @Inject(KEYCLOAK_OPTIONS) private readonly options: KeycloakOptions,
    private readonly httpService: HttpService,
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

  private get realmUrl() {
    return `${this.options.baseUrl}/auth/admin/realms/${this.options.realm}`;
  }

  private get adminClientId() {
    return this.options.adminClientId || 'admin-cli';
  }

  private _idsFromClientIds: HashMap<string> = {};

  private _controllers: any[] | undefined;

  private get controllers(): InstanceWrapper[] {
    if (this._controllers) return this._controllers;
    this._controllers = this.discoveryService.getControllers();
    return this._controllers;
  }

  private get roles() {
    return [
      ...this.controllers.reduce(
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

  private get accessToken() {
    return this.kcAdminClient.accessToken;
  }

  private get resources(): HashMap<string[]> {
    return Object.entries(
      this.controllers.reduce(
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

  async setup() {
    if (!this.options.register) return;
    this.logger.log('registering keycloak');
    await this.initKcAdminClient();
    await this.enableAuthorization();
    await this.createRoles();
    await this.createScopedResources();
  }

  private async initKcAdminClient() {
    await this.kcAdminClient.auth({
      clientId: this.adminClientId,
      grantType: 'password',
      password: this.options.adminPassword,
      username: this.options.adminUsername
    });
    this.kcAdminClient.setConfig({
      realmName: this.options.realm
    });
  }

  private async enableAuthorization() {
    await this.kcAdminClient.clients.update(
      { id: await this.getIdFromClientId(this.options.clientId) },
      {
        authorizationServicesEnabled: true,
        clientId: this.options.clientId,
        serviceAccountsEnabled: true
      }
    );
  }

  private async getIdFromClientId(clientId: string) {
    if (this._idsFromClientIds[clientId]) {
      return this._idsFromClientIds[clientId];
    }
    const idFromClientId =
      (
        (
          await lastValueFrom(
            this.httpService.get(
              `${this.realmUrl}/clients?clientId=${clientId}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.accessToken}`
                }
              }
            )
          )
        ).data as { id: string }[]
      )?.[0].id || null;
    if (!idFromClientId) {
      throw new Error(`could not find id from clientId '${clientId}'`);
    }
    this._idsFromClientIds[clientId] = idFromClientId;
    return idFromClientId;
  }

  private async createRoles() {
    const keycloakRoles = (await this.getRoles()).reduce(
      (roles: string[], { name }: RoleRepresentation) => {
        if (name) roles.push(name);
        return roles;
      },
      []
    );
    const rolesToCreate = difference(this.applicationRoles, keycloakRoles);
    await Promise.all(
      rolesToCreate.map(async (role: string) =>
        this.kcAdminClient.clients.createRole({
          id: await this.getIdFromClientId(this.options.clientId),
          name: role
        })
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
        const scopesToAttach = await this.createScopes(scopes);
        if (
          new Set(
            resources.map((resource: ResourceRepresentation) => resource.name)
          ).has(resourceName)
        ) {
          // TODO: what if the scope exists on another resource but was just added to a new resource???
          const resourceById = await this.getResourceById(resource?.id || '');
          const existingScopes = (resourceById.scopes || []).reduce(
            (existingScopes: string[], scope: ScopeRepresentation) => {
              if (scope.name) existingScopes.push(scope.name);
              return existingScopes;
            },
            []
          );
          const scopesToCreate = difference(scopes, existingScopes);
          if (scopesToCreate.length) {
            const scopesToAttach = await this.createScopes(scopesToCreate);
            this.updateResource(resourceById, scopesToAttach);
          }
        } else {
          await this.createResource(resourceName, scopesToAttach);
        }
      })
    );
  }

  private async createScopes(scopes: string[]): Promise<ScopeRepresentation[]> {
    const createdScopes = await this.getScopes();
    const scopesToCreate = difference(
      scopes,
      createdScopes.reduce(
        (createdScopes: string[], scope: ScopeRepresentation) => {
          if (scope.name) createdScopes.push(scope.name);
          return createdScopes;
        },
        []
      )
    );
    await Promise.all(
      scopesToCreate.map(async (scopeName: string) => {
        const scope = await this.createScope(scopeName);
        if (scope) createdScopes.push(scope);
      })
    );
    return createdScopes;
  }

  private async getRoles(): Promise<RoleRepresentation[]> {
    return this.kcAdminClient.clients.listRoles({
      id: await this.getIdFromClientId(this.options.clientId)
    });
  }

  private async getClientUrl(): Promise<string> {
    return `${this.realmUrl}/clients/${await this.getIdFromClientId(
      this.options.clientId
    )}`;
  }

  private async getResources(): Promise<ResourceRepresentation[]> {
    return (
      (
        await lastValueFrom(
          this.httpService.get<ResourceRepresentation[]>(
            `${await this.getClientUrl()}/authz/resource-server/resource`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.accessToken}`
              }
            }
          )
        )
      ).data || []
    );
  }

  async createResource(
    resourceName: string,
    scopes: ScopeRepresentation[] = []
  ): Promise<ResourceRepresentation> {
    return this.kcAdminClient.clients.createResource(
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

  async getResourceById(resourceId: string): Promise<ResourceRepresentation> {
    return (
      await lastValueFrom(
        this.httpService.get(
          `${this.realmUrl}/clients/${this.options.clientId}/authz/resource-server/resource/${resourceId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.accessToken}`
            }
          }
        )
      )
    ).data;
  }

  async updateResource(
    resource: ResourceRepresentation,
    scopes: ScopeRepresentation[]
  ) {
    return this.kcAdminClient.clients.updateResource(
      {
        id: await this.getIdFromClientId(this.options.clientId),
        resourceId: resource.id || ''
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

  async getScopes(): Promise<ScopeRepresentation[]> {
    return (
      await lastValueFrom(
        this.httpService.get<ScopeRepresentation[]>(
          `${await this.getClientUrl()}/authz/resource-server/scope`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.accessToken}`
            }
          }
        )
      )
    ).data;
  }

  async createScope(scope: string) {
    return (
      await lastValueFrom(
        this.httpService.post<ScopeRepresentation>(
          `${await this.getClientUrl()}/authz/resource-server/scope`,
          { name: scope },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.accessToken}`
            }
          }
        )
      )
    ).data;
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
