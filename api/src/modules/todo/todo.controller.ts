/*
 *  File: /src/modules/todo/todo.controller.ts
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

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoListArgs, Todo } from './todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('list')
  getTodoLists() {
    return this.todoService.getTodoLists();
  }

  @Get('list/:title')
  getTodoList(@Param('title') title: string) {
    return this.todoService.getTodoList(title);
  }

  @Post('list')
  createTodoList(@Body() createTodoList: CreateTodoListArgs) {
    return this.todoService.createTodoList(createTodoList.title);
  }

  @Post('list/:title')
  addTodo(@Param('title') title: string, @Body() todo: Todo) {
    return this.todoService.addTodo(title, todo);
  }

  @Delete('list/:title/:todoName')
  removeTodo(@Param('title') title: string, @Param('todoName') todoName: string) {
    return this.todoService.removeTodo(title, todoName);
  }

  @Patch('list/:title/:todoName')
  toggleTodo(@Param('title') title: string, @Param('todoName') todoName: string) {
    return this.todoService.toggleTodo(title, todoName);
  }
}
