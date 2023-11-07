/*
 *  File: /src/modules/todo/todo.resolver.ts
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

import { Arg, Args, Mutation, Query } from 'type-graphql';
import { CreateTodoListArgs, Todo, TodoList } from './todo.dto';
import { Resolver } from '@multiplatform.one/nestjs-keycloak-typegraphql';
import { TodoService } from './todo.service';

@Resolver()
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [TodoList])
  async todoLists() {
    return this.todoService.getTodoLists();
  }

  @Query(() => TodoList)
  async getTodoList(@Arg('title') title: string) {
    return this.todoService.getTodoList(title);
  }

  @Mutation(() => TodoList)
  async createTodoList(@Args() { title }: CreateTodoListArgs) {
    return this.todoService.createTodoList(title);
  }

  @Mutation(() => Todo)
  async addTodo(@Arg('title') title: string, @Arg('todo') todo: Todo) {
    return this.todoService.addTodo(title, todo);
  }

  @Mutation(() => Boolean)
  async removeTodo(@Arg('title') title: string, @Arg('todoName') todoName: string) {
    return this.todoService.removeTodo(title, todoName);
  }

  @Mutation(() => Todo)
  async toggleTodo(@Arg('title') title: string, @Arg('todoName') todoName: string) {
    return this.todoService.toggleTodo(title, todoName);
  }
}
