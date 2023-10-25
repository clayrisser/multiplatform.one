/*
 *  File: /src/modules/core/auth/auth.controller.ts
 *  Project: api
 *  File Created: 18-09-2023 08:18:09
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2023
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

import { ApiBody } from '@nestjs/swagger';
import { Authorized, Resource } from '@multiplatform.one/nestjs-keycloak';
import { GrantProperties, KeycloakService, UserInfo } from '@multiplatform.one/nestjs-keycloak';
import { Logger, Controller, Post, Body, Get } from '@nestjs/common';
import { LoginRequestDto } from './auth.dto';
import { LoginResponseDto } from './auth.dto';

@Resource('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');

  constructor(private readonly keycloakService: KeycloakService) {}

  @Post('login')
  @ApiBody({ type: LoginRequestDto })
  async postLogin(@Body() body: LoginRequestDto): Promise<LoginResponseDto | undefined> {
    const grant = await this.keycloakService.directGrant({
      password: body.password || '',
      scope: body.scope,
      username: body.username || '',
    });
    if (!grant) return;
    const userInfo = await this.keycloakService.getUserInfo();
    if (!userInfo) return;
    return {
      accessToken: (grant.access_token as any)?.token || '',
      refreshToken: (grant.refresh_token as any)?.token || '',
      userInfo,
    };
  }

  @Authorized()
  @Get('grant')
  async getGrant(): Promise<GrantProperties | undefined> {
    return (await this.keycloakService.getGrant()) as GrantProperties;
  }

  @Authorized()
  @Get('userinfo')
  async getUserInfo(): Promise<UserInfo | undefined> {
    return this.keycloakService.getUserInfo();
  }

  @Authorized()
  @Get('username')
  async getUsername(): Promise<string | undefined> {
    return this.keycloakService.getUsername();
  }

  @Authorized()
  @Get('userid')
  async getUserid(): Promise<string | undefined> {
    return this.keycloakService.getUserId();
  }

  @Authorized()
  @Get('roles')
  async getRoles(): Promise<string[]> {
    return (await this.keycloakService.getRoles()) || [];
  }

  @Authorized()
  @Get('scopes')
  async getScopes(): Promise<string[]> {
    return (await this.keycloakService.getScopes()) || [];
  }

  @Authorized()
  @Get('user')
  async getUser(): Promise<any> {
    return (await this.keycloakService.getUser()) || {};
  }
}
