/**
 * File: /src/keycloakRegister.service.ts
 * Project: nestjs-keycloak
 * File Created: 14-07-2021 11:43:59
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 19-07-2021 01:14:45
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
import RoleRepresentation from 'keycloak-admin/lib/defs/roleRepresentation';
import difference from 'lodash.difference';
import qs from 'qs';
import { AxiosResponse } from 'axios';
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

const kcAdminClient = new KcAdminClient();

export default class KeycloakRegisterService {
  private logger = new Logger(KeycloakRegisterService.name);

  private registerOptions: RegisterOptions;

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
    this.realmUrl = `${this.options.baseUrl}/auth/admin/realms/${this.options.realm}`;
    this.adminClientId = this.options.adminClientId || 'admin-cli';
  }

  private _accessToken?: string;

  private realmUrl: string;

  private _controllers: any[] | undefined;

  private adminClientId: string;

  get controllers(): InstanceWrapper[] {
    if (this._controllers) return this._controllers;
    this._controllers = this.discoveryService.getControllers();
    return this._controllers;
  }

  get roles() {
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

  get applicationRoles() {
    return this.roles.filter((role: string) => !/^realm:/g.test(role));
  }

  get realmRoles() {
    return this.roles
      .filter((role: string) => /^realm:/g.test(role))
      .map((role: string) => role.replace(/^realm:/g, ''));
  }

  get resources(): HashMap<string[]> {
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
    await this.createRoles();
    await this.createScopedResources();
  }

  async initKcAdminClient() {
    await kcAdminClient.auth({
      clientId: this.adminClientId,
      grantType: 'password',
      password: this.options.adminPassword,
      username: this.options.adminUsername
    });
    kcAdminClient.setConfig({
      realmName: this.options.realm
    });
  }

  async enableAuthorization() {
    await lastValueFrom(
      this.httpService.put(
        `${this.realmUrl}/clients/${this.options.clientId}`,
        {
          authorizationServicesEnabled: true,
          clientId: this.options.clientId,
          serviceAccountsEnabled: true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await this.getAccessToken()}`
          }
        }
      )
    );
  }

  async createRoles() {
    const keycloakRoles = (await this.getRoles()).reduce(
      (roles: string[], { name }: RoleRepresentation) => {
        if (name) roles.push(name);
        return roles;
      },
      []
    );
    const rolesToCreate = difference(this.applicationRoles, keycloakRoles);
    await Promise.all(
      rolesToCreate.map((role: string) =>
        kcAdminClient.clients.createRole({
          id: this.options.adminClientId,
          name: role
        })
      )
    );
  }

  async createScopedResources() {
    const resources = await this.getResources();
    await Promise.all(
      Object.keys(this.resources).map(async (resourceName: string) => {
        const resource = resources.find(
          (resource: Resource) => resource.name === resourceName
        );
        const scopes = this.resources[resourceName];
        const scopesToAttach = await this.createScopes(scopes);
        if (
          new Set(resources.map((resource: Resource) => resource.name)).has(
            resourceName
          )
        ) {
          // TODO: what if the scope exists on another resource but was just added to a new resource???
          const resourceById = await this.getResourceById(resource?._id || '');
          const existingScopes = resourceById.scopes.map((scope: Scope) => {
            return scope.name;
          });
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

  async createScopes(scopes: string[]): Promise<Scope[]> {
    const createdScopes = await this.getScopes();
    const scopesToCreate = difference(
      scopes,
      createdScopes.map((scope: Scope) => scope.name)
    );
    await Promise.all(
      scopesToCreate.map(async (scopeName: string) => {
        const scope = await this.createScope(scopeName);
        if (scope) createdScopes.push(scope);
      })
    );
    return createdScopes;
  }

  async getRoles(): Promise<RoleRepresentation[]> {
    return kcAdminClient.clients.listRoles({
      id: this.options.adminClientId || ''
    });
  }

  async getAccessToken() {
    if (this._accessToken) return this._accessToken;
    this._accessToken = (
      await lastValueFrom(
        this.httpService.post(
          `${this.options.baseUrl}/auth/realms/master/protocol/openid-connect/token`,
          qs.stringify({
            client_id: this.adminClientId,
            grant_type: 'password',
            password: this.options.adminPassword || '',
            username: this.options.adminUsername || ''
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }
        )
      )
    )?.data?.access_token;
    return this._accessToken;
  }

  async getResources() {
    return (
      (
        await lastValueFrom(
          this.httpService.get<Resource[]>(
            `${this.realmUrl}/clients/${this.options.adminClientId}/authz/resource-server/resource`,
            {
              headers: {
                Authorization: `Bearer ${await this.getAccessToken()}`
              }
            }
          )
        )
      ).data || []
    );
  }

  async createResource(
    resourceName: string,
    scopes: Scope[] = []
  ): Promise<AxiosResponse<any> | undefined> {
    return (
      await lastValueFrom(
        this.httpService.post(
          `${this.realmUrl}/clients/${this.options.adminClientId}/authz/resource-server/resource`,
          {
            attributes: {},
            displayName: resourceName,
            name: resourceName,
            ownerManagedAccess: '',
            scopes,
            uris: []
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await this.getAccessToken()}`
            }
          }
        )
      )
    ).data;
  }

  async getResourceById(resourceId: string) {
    return (
      await lastValueFrom(
        this.httpService.get(
          `${this.realmUrl}/clients/${this.options.adminClientId}/authz/resource-server/resource/${resourceId}`,
          {
            headers: {
              Authorization: `Bearer ${await this.getAccessToken()}`
            }
          }
        )
      )
    ).data;
  }

  async updateResource(resource: Resource, scopes: Array<Scope>) {
    return (
      await lastValueFrom(
        this.httpService.put(
          `${this.realmUrl}/clients/${this.options.adminClientId}/authz/resource-server/resource/${resource?._id}`,
          qs.stringify({
            attributes: {},
            displayName: resource?.name,
            name: resource?.name,
            owner: {
              id: this.options.adminClientId,
              name: this.options.realm
            },
            ownerManagedAccess: false,
            scopes,
            uris: [],
            _id: resource?._id
          }),
          {
            headers: {
              Authorization: `Bearer ${await this.getAccessToken()}`
            }
          }
        )
      )
    ).data;
  }

  async getScopes() {
    return (
      await lastValueFrom(
        this.httpService.get<Scope[]>(
          `${this.realmUrl}/clients/${this.options.adminClientId}/authz/resource-server/scope`,
          {
            headers: {
              Authorization: `Bearer ${await this.getAccessToken()}`
            }
          }
        )
      )
    ).data;
  }

  async createScope(scope: string) {
    return (
      await lastValueFrom(
        this.httpService.post<Scope>(
          `${this.realmUrl}/clients/${this.options.adminClientId}/authz/resource-server/scope`,
          { name: scope },
          {
            headers: {
              Authorization: `Bearer ${await this.getAccessToken()}`
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

export interface Role {
  clientRole: boolean;
  composite: boolean;
  containerId: string;
  id: string;
  name: string;
}

export interface Resource {
  name: string;
  owner: Resource;
  ownerManagedAccess: boolean;
  displayName: string;
  type: string;
  uris: [string];
  id: string;
  _id?: string;
  scopes: [Scope];
}

export interface ResourceOwner {
  id: string;
  name: string;
}

export interface Data {
  roles: string[];
  resources: DataResources;
}

export interface DataResources {
  [key: string]: Array<string>;
}

export interface Scope {
  name: string;
  id: string;
}
