/*
 *  File: /src/modules/rocket/rocket.controller.ts
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

import { Body, Controller, Get, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectUsername, Private } from '@multiplatform.one/nestjs-keycloak';
import { ApiController, DTO, Property } from '@multiplatform.one/typegraphql-nestjs-decorators';

@DTO()
class User {
  @Property({}, { title: 'id', description: 'The id of the user.' })
  id!: string;
}

@ApiController('rockets')
export class RocketController {
  constructor(private readonly http: HttpService) {}

  @Get('username')
  getUsername(@InjectUsername() username: string) {
    return username;
  }

  @Get()
  async getRockets() {
    return (await this.http.axiosRef.get('https://api.spacex.land/rest/rockets')).data;
  }

  @Post('user')
  async getUser(@Body() body: User) {
    return body;
  }

  @Private()
  @Get('hello')
  async getHello() {
    return { hello: 'world' };
  }
}
