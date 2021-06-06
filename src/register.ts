import KcAdminClient from 'keycloak-admin';
import _ from 'lodash';
import qs from 'qs';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { HttpService } from '@nestjs/common';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { HashMap, Options } from '~/types';
import { RESOURCE } from '~/decorators/resource.decorator';
import { ROLES } from '~/decorators/roles.decorator';
import { SCOPES } from '~/decorators/scopes.decorator';

const kcAdminClient = new KcAdminClient();

export default class Register {
  constructor(
    private readonly options: Options,
    private httpService: HttpService,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector
  ) {
    this.realmUrl = `${this.options.baseUrl}/auth/admin/realms/${this.options.realm}`;
  }

  private _accessToken?: string;

  private _createdScopes: Set<Scope> = new Set();

  private realmUrl: string;

  private _controllers: any[] | undefined;

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
          const values = this.reflector.getAllAndMerge(ROLES, [
            controller.metatype,
            ...methods
          ]);
          return new Set([...roles, ...values]);
        },
        new Set()
      )
    ];
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
        resources[resourceName] = [...scopes];
        return resources;
      },
      {}
    );
  }

  async setup() {
    console.log('registering keycloak . . .');
    const data: Data = {
      roles: this.roles,
      resources: this.resources
    };
    await kcAdminClient.auth({
      username: this.options.adminUsername,
      password: this.options.adminPassword,
      grantType: 'password',
      clientId: 'admin-cli'
    });
    kcAdminClient.setConfig({
      realmName: this.options.realm
    });
    await this.enableAuthorization();
    const getRolesRes: any = await this.getRoles();
    const roleNames = _.map(getRolesRes, 'name');
    const rolesToCreate = _.difference(data.roles, roleNames);
    rolesToCreate.forEach((role) => {
      this.createRoles(role);
    });
    const resources = await this.getResources();
    await Promise.all(
      Object.keys(data.resources).map(async (resourceName: string) => {
        const resource = resources.find(
          (resource: Resource) => resource.name === resourceName
        );
        const scopes: Array<string> = data.resources[resourceName];
        const scopesToAttach = await this.createScopes(scopes);
        if (
          !new Set(resources.map((resource: Resource) => resource.name)).has(
            resourceName
          )
        ) {
          await this.createResource(resourceName, scopesToAttach);
        } else {
          // What if the scope exists on another resource but was just added to a new resource???
          const resourceById = await this.getResourceById(resource?._id || '');
          const existingScopes = resourceById.scopes.map((scope: Scope) => {
            return scope.name;
          });
          const scopesToCreate: any = _.difference(scopes, existingScopes);
          if (scopesToCreate.length > 0) {
            const createdScopes = await this.createScopes(scopesToCreate);
            this.updateResource(resourceById, createdScopes);
          }
        }
      })
    );
  }

  async createScopes(scopes: Array<string>): Promise<Scope[]> {
    const scopesRes = await this.getScopes();
    const createdScopes: Array<Scope> = [
      ...this._createdScopes,
      ...scopesRes.data
    ];
    const scopesToCreate = _.difference(
      scopes,
      createdScopes.map((scope: Scope) => scope.name)
    );
    await Promise.all(
      scopesToCreate.map(async (scopeName: string) => {
        const scope: Scope | {} = (await this.createScope(scopeName)).data;
        if ('id' in scope) createdScopes.push(scope);
      })
    );
    this._createdScopes = new Set(createdScopes);
    return createdScopes;
  }

  async enableAuthorization() {
    await kcAdminClient.clients.update(
      { id: this.options.adminClientId || '' },
      {
        clientId: this.options.clientId,
        authorizationServicesEnabled: true,
        serviceAccountsEnabled: true
      }
    );
  }

  async getRoles() {
    return kcAdminClient.clients.listRoles({
      id: this.options.adminClientId || ''
    });
  }

  async createRoles(role: string) {
    return kcAdminClient.clients.createRole({
      id: this.options.adminClientId,
      name: role
    });
  }

  async getAccessToken() {
    if (this._accessToken) return this._accessToken;
    this._accessToken = (
      await this.httpService
        .post(
          `${this.options.baseUrl}/auth/realms/master/protocol/openid-connect/token`,
          qs.stringify({
            client_id: 'admin-cli',
            grant_type: 'password',
            username: 'admin',
            password: 'pass'
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }
        )
        .toPromise()
    ).data.access_token;
    return this._accessToken;
  }

  async getResources() {
    const resourcesRes = await this.httpService
      .get<[Resource]>(
        `${this.realmUrl}/clients/${this.options.adminClientId}/authz/resource-server/resource`,
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`
          }
        }
      )
      .toPromise();
    return resourcesRes.data;
  }

  async createResource(resourceName: string, scopes: Scope[] = []) {
    return this.httpService
      .post(
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
      .toPromise();
  }

  async getResourceById(resourceId: string) {
    const resource = await this.httpService
      .get(
        `${this.realmUrl}/clients/${this.options.adminClientId}/authz/resource-server/resource/${resourceId}`,
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`
          }
        }
      )
      .toPromise();
    return (await resource).data;
  }

  async updateResource(resource: Resource, scopes: Array<Scope>) {
    return this.httpService
      .put(
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
      .toPromise();
  }

  async getScopes() {
    const scopes = await this.httpService
      .get<Array<Scope>>(
        `${this.realmUrl}/clients/${this.options.adminClientId}/authz/resource-server/scope`,
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`
          }
        }
      )
      .toPromise();
    return scopes;
  }

  async createScope(scope: string) {
    return this.httpService
      .post<Scope>(
        `${this.realmUrl}/clients/${this.options.adminClientId}/authz/resource-server/scope`,
        { name: scope },
        {
          headers: {
            Authorization: `Bearer ${await this.getAccessToken()}`
          }
        }
      )
      .toPromise();
  }
}

function getMethods(obj: any): ((...args: any[]) => any)[] {
  const propertyNames = new Set<string>();
  let current = obj;
  do {
    Object.getOwnPropertyNames(current).map((propertyName) =>
      propertyNames.add(propertyName)
    );
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
  roles: Array<string>;
  resources: DataResources;
}

export interface DataResources {
  [key: string]: Array<string>;
}

export interface Scope {
  name: string;
  id: string;
}
