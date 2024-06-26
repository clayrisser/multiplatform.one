/*
 *  File: /src/keycloakService.ts
 *  Project: @multiplatform.one/keycloak-typegraphql
 *  File Created: 11-01-2024 14:38:09
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

import axios from 'axios';
import cookie from 'cookie';
import type UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import type { AxiosError } from 'axios';
import type { Ctx } from '@multiplatform.one/typegraphql';
import type { Grant } from 'keycloak-connect';
import type { KeycloakConnect } from './initialize';
import type { Session } from '@multiplatform.one/keycloak';
import { KEYCLOAK_CONNECT, KEYCLOAK_OPTIONS, KeycloakAdmin } from './initialize';
import { Token } from './token';
import { decode } from 'next-auth/jwt';
import { getReqHeader, Logger } from '@multiplatform.one/typegraphql';
import { injectable, scoped, Lifecycle, inject } from 'tsyringe';
import type {
  AuthorizationCodeGrantOptions,
  ClientCredentialsGrantOptions,
  DirectGrantOptions,
  KeycloakOptions,
  KeycloakRequest,
  RefreshTokenGrantOptions,
  SmartGrantOptions,
  UserInfo,
} from './types';

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class KeycloakService {
  options: KeycloakOptions;

  private _bearerToken: Token | undefined;

  private _refreshToken: Token | undefined;

  private _accessToken: Token | undefined;

  private _idToken: Token | undefined;

  private _userInfo: UserInfo | undefined;

  private _grant: Grant | undefined;

  private _roles: string[] | undefined;

  private _aclRoles: string[] | undefined;

  private _scopes: string[] | undefined;

  private _nextAuthSession: Session | undefined;

  constructor(
    @inject('REQ') public readonly req: KeycloakRequest,
    @inject(KEYCLOAK_OPTIONS) options: KeycloakOptions,
    @inject('LOGGER') private readonly logger: Logger,
    @inject(KEYCLOAK_CONNECT) public readonly keycloakConnect: KeycloakConnect,
    public readonly keycloakAdmin: KeycloakAdmin,
    @inject('CTX') public readonly ctx?: Ctx,
  ) {
    this.options = {
      ensureFreshness: true,
      nextAuthCookieName: 'next-auth.session-token',
      ...options,
    };
  }

  get clientId(): string {
    return (this.keycloakConnect.grantManager as any).clientId;
  }

  async getGrant(force = false, grant?: Grant): Promise<Grant | undefined> {
    if (grant) return grant;
    if (!force && this._grant) {
      return this.validateGrant(this._grant);
    }
    if (force) this.clearGrant();
    await this.setOptions();
    if (this.req.kauth?.grant) {
      try {
        const grant = await this.validateGrant(this.req.kauth.grant);
        await this.afterGrant(grant);
      } catch (err) {
        this.clearGrant();
        throw err;
      }
    } else {
      const accessToken = await this.lookupAccessToken();
      if (!accessToken) {
        this.clearGrant();
        return undefined;
      }
      try {
        const refreshToken = await this.lookupRefreshToken();
        const idToken = await this.lookupIdToken();
        const grant = await this.createGrant(accessToken, idToken, refreshToken);
        await this.afterGrant(grant);
      } catch (err) {
        this.clearGrant();
        throw err;
      }
    }
    if (!this._grant) this.clearGrant();
    return this._grant;
  }

  async getAccessToken(grant?: Grant): Promise<Token | undefined> {
    return (await this.getGrant(false, grant))?.access_token as Token;
  }

  async getRefreshToken(grant?: Grant): Promise<Token | undefined> {
    return (await this.getGrant(false, grant))?.refresh_token as Token;
  }

  async getIdToken(grant?: Grant): Promise<Token | undefined> {
    return (await this.getGrant(false, grant))?.id_token as Token;
  }

  async getRoles(grant?: Grant): Promise<string[] | undefined> {
    if (this._roles) return this._roles;
    const accessToken = await this.getAccessToken(grant);
    if (!accessToken) return undefined;
    this._roles = [
      ...(accessToken.content?.realm_access?.roles || []).map((role: string) => `realm:${role}`),
      ...(accessToken.content?.resource_access?.[this.clientId]?.roles || []),
    ];
    return this._roles;
  }

  async getACLRoles(grant?: Grant): Promise<string[] | undefined> {
    if (this._aclRoles) return this._aclRoles;
    const roles = await this.getRoles(grant);
    if (!roles) return undefined;
    this._aclRoles = roles.map((role: string) => role.replace(/^realm:/g, ''));
    return this._aclRoles;
  }

  async getScopes(grant?: Grant): Promise<string[] | undefined> {
    if (this._scopes) return this._scopes;
    const accessToken = await this.getAccessToken(grant);
    if (!accessToken) return undefined;
    this._scopes = (accessToken.content?.scope || '').split(' ');
    return this._scopes;
  }

  async getUserInfo(grant?: Grant, force = false): Promise<UserInfo | undefined> {
    await this.getGrant(force, grant);
    if (this._userInfo) return this._userInfo;
    if (this.req.kauth?.userInfo) {
      this._userInfo = this.req.kauth.userInfo;
      return this._userInfo;
    }
    const nextAuthSession = await this.getNextAuthSession();
    if (!this.bearerToken && !nextAuthSession?.accessToken && this.req.session?.kauth?.userInfo) {
      this._userInfo = this.req.session.kauth.userInfo;
      return this._userInfo;
    }
    const accessToken = await this.getAccessToken(grant);
    const userInfo =
      accessToken &&
      !accessToken.isExpired() &&
      (await this.keycloakConnect.grantManager.userInfo<
        Token | string,
        {
          email_verified: boolean;
          family_name?: string;
          given_name?: string;
          preferred_username: string;
          sub: string;
          [key: string]: any;
        }
      >(accessToken));
    if (!userInfo) return undefined;
    const result = {
      emailVerified: userInfo?.email_verified,
      familyName: userInfo?.family_name,
      givenName: userInfo?.given_name,
      preferredUsername: userInfo?.preferred_username,
      ...userInfo,
    } as UserInfo;
    delete result?.email_verified;
    delete result?.family_name;
    delete result?.given_name;
    delete result?.preferred_username;
    if (!this.req.kauth) this.req.kauth = {};
    this.req.kauth.userInfo = result;
    this._userInfo = result;
    return this._userInfo;
  }

  async getUserId(grant?: Grant): Promise<string | undefined> {
    const accessToken = await this.getAccessToken(grant);
    return accessToken?.content?.sub;
  }

  async getUsername(grant?: Grant): Promise<string | undefined> {
    const accessToken = await this.getAccessToken(grant);
    return accessToken?.content?.preferred_username;
  }

  async isAuthorizedByRoles(roles: (string | string[])[] = [], grant?: Grant): Promise<boolean> {
    const accessToken = await this.getAccessToken(grant);
    const rolesArr = Array.isArray(roles) ? roles : [roles];
    if (!roles.length) return true;
    return rolesArr.some((role: string | string[]) => {
      const result = Array.isArray(role)
        ? role.every((innerRole: string) => accessToken?.hasRole(innerRole))
        : accessToken?.hasRole(role);
      return result;
    });
  }

  // username must start with `service-account-`
  async getClientFromServiceAccountUsername(username?: string, grant?: Grant) {
    if (!username) username = await this.getUsername(grant);
    if (!username) return undefined;
    const clientId = (username.match(/service-account-(.+)/) || [])?.[1];
    if (!clientId) return undefined;
    if (!this.keycloakAdmin) return undefined;
    try {
      return (
        (await this.keycloakAdmin.clients.findOne({
          clientId,
        } as any)) || undefined
      );
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status !== 404) throw err;
      this.logger.error(err);
      return undefined;
    }
  }

  async getUser(userId?: string, grant?: Grant): Promise<UserRepresentation | undefined> {
    if (!userId) userId = await this.getUserId(grant);
    if (!userId) return undefined;
    if (!this.keycloakAdmin) return undefined;
    try {
      return (await this.keycloakAdmin.users.findOne({ id: userId })) || undefined;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status !== 404) throw err;
      return undefined;
    }
  }

  async smartGrant(options: SmartGrantOptions, persistSession = true): Promise<Grant | undefined> {
    let grant: Grant | undefined;
    if (options.refreshToken) {
      grant = await this.refreshTokenGrant(
        {
          refreshToken: options.refreshToken,
          clientId: options.clientId,
        },
        persistSession,
      );
    } else if (options.code) {
      grant = await this.authorizationCodeGrant(
        {
          code: options.code,
          redirectUri: options.redirectUri,
          clientId: options.clientId,
          sessionHost: options.sessionHost,
          sessionId: options.sessionId,
          codeVerifier: options.codeVerifier,
        },
        persistSession,
      );
    } else if (options.clientSecret) {
      grant = await this.clientCredentialsGrant(
        {
          clientId: options.clientId,
          clientSecret: options.clientSecret,
          scope: options.scope,
        },
        persistSession,
      );
    } else if (options.username && options.password) {
      grant = await this.directGrant(
        {
          username: options.username,
          password: options.password,
          scope: options.scope,
          clientId: options.clientId,
        },
        persistSession,
      );
    }
    return grant;
  }

  async directGrant(
    { username, password, scope, clientId }: DirectGrantOptions,
    persistSession = true,
  ): Promise<Grant | undefined> {
    let grant: Grant | undefined;
    if (clientId) {
      const res = await axios.post(
        `${this.options.baseUrl}/realms/${this.options.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: clientId,
          username,
          password,
          grant_type: 'password',
          scope: this.serializeScope(scope),
        }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      grant = await this.keycloakConnect.grantManager.createGrant(res.data);
    } else {
      grant = await this.keycloakConnect.grantManager.obtainDirectly(
        username,
        password,
        // @ts-ignore missing scope argument
        undefined,
        this.serializeScope(scope),
      );
    }
    if (!grant) return undefined;
    if (persistSession) this.sessionSetTokens(grant.access_token as Token, grant.refresh_token as Token);
    await this.afterGrant(grant);
    return grant;
  }

  async clientCredentialsGrant(
    { clientId, clientSecret, scope }: ClientCredentialsGrantOptions,
    persistSession = true,
  ): Promise<Grant | undefined> {
    if (!clientSecret) clientSecret = this.options.clientSecret;
    let grant: Grant | undefined;
    if (clientId) {
      const res = await axios.post(
        `${this.options.baseUrl}/realms/${this.options.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          ...(clientSecret ? { client_secret: clientSecret } : {}),
          client_id: clientId,
          grant_type: 'client_credentials',
          scope: this.serializeScope(scope),
        }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      grant = await this.keycloakConnect.grantManager.createGrant(res.data);
    } else {
      grant = await this.keycloakConnect.grantManager.obtainFromClientCredentials(
        // @ts-ignore missing scope argument
        undefined,
        this.serializeScope(scope),
      );
    }
    if (!grant) return undefined;
    if (persistSession) this.sessionSetTokens(grant.access_token as Token, grant.refresh_token as Token);
    await this.afterGrant(grant);
    return grant;
  }

  async refreshTokenGrant(
    { refreshToken, clientId }: RefreshTokenGrantOptions,
    persistSession = true,
  ): Promise<Grant | undefined> {
    if (!clientId) clientId = this.clientId;
    const res = await axios.post(
      `${this.options.baseUrl}/realms/${this.options.realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    const grant = await this.keycloakConnect.grantManager.createGrant(res.data);
    if (!grant) return undefined;
    if (persistSession) this.sessionSetTokens(grant.access_token as Token, grant.refresh_token as Token);
    await this.afterGrant(grant);
    return grant;
  }

  async authorizationCodeGrant(
    { code, redirectUri, clientId, sessionHost, sessionId, codeVerifier }: AuthorizationCodeGrantOptions,
    persistSession = true,
  ): Promise<Grant | undefined> {
    let grant: Grant | undefined;
    if (clientId || redirectUri || codeVerifier) {
      if (!clientId) clientId = this.clientId;
      if (!redirectUri) redirectUri = this.req.session ? this.req.session.auth_redirect_uri : undefined;
      const res = await axios.post(
        `${this.options.baseUrl}/realms/${this.options.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          ...(codeVerifier ? { code_verifier: codeVerifier } : {}),
          ...(sessionHost ? { client_session_host: sessionHost } : {}),
          ...(sessionId ? { client_session_state: sessionId } : {}),
          client_id: clientId,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri ? redirectUri : '',
        }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      grant = await this.keycloakConnect.grantManager.createGrant(res.data);
    } else {
      grant = await this.keycloakConnect.grantManager.obtainFromCode(
        // @ts-ignore first argument is req
        this.req,
        code,
        sessionId,
        sessionHost,
      );
    }
    if (!grant) return undefined;
    if (persistSession) this.sessionSetTokens(grant.access_token as Token, grant.refresh_token as Token);
    await this.afterGrant(grant);
    return grant;
  }

  async logout(redirectUri: string): Promise<LogoutResult> {
    this.clearGrant();
    await this.clearSession();
    return { redirect: this.keycloakConnect.logoutUrl(redirectUri) };
  }

  private get bearerToken(): Token | undefined {
    if (this._bearerToken) return this._bearerToken;
    const { strict } = this.options;
    const authorization = getReqHeader(this.req, 'authorization', this.ctx?.headers);
    if (typeof authorization === 'undefined') return undefined;
    if (authorization && authorization.indexOf(' ') <= -1) {
      if (strict) return undefined;
      this._bearerToken = new Token(authorization, this.clientId);
      return this._bearerToken;
    }
    const authorizationArr = authorization?.split(' ');
    if (authorizationArr?.[0] && authorizationArr[0].toLowerCase() === 'bearer') {
      this._bearerToken = new Token(authorizationArr[1], this.clientId);
      return this._bearerToken;
    }
    return undefined;
  }

  private async getNextAuthSession() {
    if (this._nextAuthSession) return this._nextAuthSession;
    const chunks: Record<string, string> = {};
    const cookies = cookie.parse(getReqHeader(this.req, 'cookie') || '');
    const cookieName = this.options.nextAuthCookieName!;
    Object.keys(cookies).forEach((name) => {
      if (name.startsWith(cookieName)) chunks[name] = cookies[name];
    });
    const sortedKeys = Object.keys(chunks).sort((a, b) => {
      const aSuffix = parseInt(a.split('.').pop() ?? '0', 10);
      const bSuffix = parseInt(b.split('.').pop() ?? '0', 10);
      return aSuffix - bSuffix;
    });
    if (!sortedKeys.length) return undefined;
    const token = sortedKeys.map((key) => chunks[key]).join('');
    try {
      this._nextAuthSession = (await decode({ token, secret: this.options.secret || '' })) as unknown as
        | Session
        | undefined;
      return this._nextAuthSession;
    } catch (err) {
      this.logger.error(err);
      return undefined;
    }
  }

  private async lookupRefreshToken(): Promise<Token | undefined> {
    if (this._refreshToken) return this._refreshToken;
    const refreshToken = this.req.kauth?.grant?.refresh_token as Token | undefined;
    if (refreshToken) {
      this._refreshToken = refreshToken;
      return this._refreshToken;
    }
    const nextAuthSession = await this.getNextAuthSession();
    if (nextAuthSession?.refreshToken) {
      this._refreshToken = new Token(nextAuthSession.refreshToken, this.clientId);
      return this._refreshToken;
    }
    this._refreshToken = this.req.session?.kauth?.refreshToken
      ? new Token(this.req.session?.kauth.refreshToken, this.clientId)
      : undefined;
    return this._refreshToken;
  }

  private async lookupAccessToken(): Promise<Token | undefined> {
    if (this._accessToken) return this._accessToken;
    const accessToken = this.req.kauth?.grant?.access_token as Token | undefined;
    if (accessToken) {
      this._accessToken = accessToken;
      return this._accessToken;
    }
    if (this.bearerToken) {
      this._accessToken = this.bearerToken;
      return this._accessToken;
    }
    const nextAuthSession = await this.getNextAuthSession();
    if (nextAuthSession?.accessToken) {
      this._accessToken = new Token(nextAuthSession.accessToken, this.clientId);
      return this._accessToken;
    }
    this._accessToken = this.req.session?.kauth?.accessToken
      ? new Token(this.req.session?.kauth.accessToken, this.clientId)
      : undefined;
    return this._accessToken;
  }

  private async lookupIdToken(): Promise<Token | undefined> {
    if (this._idToken) return this._idToken;
    const idToken = this.req.kauth?.grant?.id_token as Token | undefined;
    if (idToken) {
      this._idToken = idToken;
      return this._idToken;
    }
    const nextAuthSession = await this.getNextAuthSession();
    if (nextAuthSession?.idToken) {
      this._idToken = new Token(nextAuthSession.idToken, this.clientId);
      return this._idToken;
    }
    this._idToken = this.req.session?.kauth?.idToken
      ? new Token(this.req.session?.kauth.idToken, this.clientId)
      : undefined;
    return this._idToken;
  }

  private async afterGrant(grant?: Grant) {
    if (!grant) {
      this.clearGrant();
      return;
    }
    delete this._aclRoles;
    delete this._idToken;
    delete this._refreshToken;
    delete this._roles;
    delete this._scopes;
    delete this._userInfo;
    this._grant = grant;
    this._accessToken = grant.access_token as Token;
    if (grant.id_token) this._idToken = grant.id_token as Token;
    if (grant.refresh_token) this._refreshToken = grant.refresh_token as Token;
    this.req.kauth = {
      grant,
      keycloak: this,
      options: this.options,
      roles: await this.getRoles(),
      aclRoles: await this.getACLRoles(),
    };
  }

  private clearGrant() {
    delete this._accessToken;
    delete this._aclRoles;
    delete this._bearerToken;
    delete this._grant;
    delete this._idToken;
    delete this._nextAuthSession;
    delete this._refreshToken;
    delete this._roles;
    delete this._scopes;
    delete this._userInfo;
    delete this.req.kauth;
  }

  private async clearSession() {
    if (!this.req.session) return;
    delete this.req.session.kauth;
    delete this.req.session.token;
    await new Promise<void>((resolve, reject) => {
      if (!this.req.session?.destroy) return resolve();
      this.req.session?.destroy((err: Error) => {
        if (err) return reject(err);
        return resolve();
      });
    });
    return;
  }

  private sessionSetTokens(accessToken?: Token, refreshToken?: Token) {
    if (this.req.session) {
      if (!this.req.session.kauth) this.req.session.kauth = {};
      if (refreshToken) {
        this.req.session.kauth.refreshToken = refreshToken.token;
      }
      if (accessToken) {
        this.req.session.kauth.accessToken = accessToken.token;
        this.req.session.token = accessToken.token;
      }
    }
  }

  private async setOptions() {
    if (!this.req.kauth) this.req.kauth = {};
    this.req.kauth.options = this.options;
  }

  private async createGrant(accessToken: Token, idToken?: Token, refreshToken?: Token): Promise<Grant | undefined> {
    return (
      this.keycloakConnect.grantManager.createGrant({
        // access_token is actually a string even though keycloak-connect
        // thinks it is a Token
        // @ts-ignore
        access_token: accessToken.token,
        // id_token is actually a string even though keycloak-connect
        // thinks it is a Token
        ...(idToken ? { id_token: idToken.token } : {}),
        // refresh_token is actually a string even though keycloak-connect
        // thinks it is a Token
        ...(this.options.ensureFreshness && refreshToken ? { refresh_token: refreshToken.token } : {}),
        ...(accessToken.content?.exp ? { expires_in: accessToken.content.exp } : {}),
        ...(accessToken.content?.typ ? { token_type: accessToken.content.typ } : {}),
      }) || undefined
    );
  }

  private async validateGrant(grant: Grant): Promise<Grant | undefined> {
    // @ts-ignore isGrantRefreshable is private
    if (this.options.ensureFreshness && this.keycloakConnect.grantManager.isGrantRefreshable(grant)) {
      await this.keycloakConnect.grantManager.ensureFreshness(grant);
    }
    return this.keycloakConnect.grantManager.validateGrant(grant);
  }

  private serializeScope(scope?: string | string[]) {
    return ['openid', ...(Array.isArray(scope) ? scope : (scope || 'profile').split(' '))].join(' ');
  }
}

export interface TokenResponseData {
  'not-before-policy'?: number;
  access_token?: string;
  expires_in?: number;
  id_token?: string;
  refresh_expires_in?: number;
  refresh_token?: string;
  scope?: string;
  session_state?: string;
  token_type?: string;
}

export interface LogoutResult {
  redirect?: string;
}
