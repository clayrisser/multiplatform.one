/*
 *  File: /src/modules/todo/todo.service.ts
 *  Project: api
 *  File Created: 07-11-2023 05:39:04
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

import { Injectable } from '@nestjs/common';
import { Todo, TodoList } from './todo.dto';

const todoLists: Record<string, TodoList> = {};

@Injectable()
export class TodoService {
  getTodoLists() {
    return Object.values(todoLists);
  }

  getTodoList(title: string) {
    return todoLists[title];
  }

  createTodoList(title: string) {
    const todoList = { title, todos: [] };
    todoLists[title] = todoList;
    return todoList;
  }

  addTodo(todoListTitle: string, todo: Todo) {
    const todoList = todoLists[todoListTitle];
    if (!todoList) throw new Error(`todo list '${todoListTitle}' not found`);
    if (!todoList.todos.find((t) => t.name === todo.name)) {
      todoList.todos.push(todo);
    }
    return todo;
  }

  removeTodo(todoListTitle: string, todoName: string) {
    const todoList = todoLists[todoListTitle];
    if (!todoList) throw new Error(`todo list '${todoListTitle}' not found`);
    const index = todoList.todos.findIndex((todo) => todo.name === todoName);
    if (index !== -1) {
      todoList.todos.splice(index, 1);
      return true;
    } else {
      throw new Error(`todo '${todoName}' not found in list '${todoListTitle}'`);
    }
  }

  toggleTodo(todoListTitle: string, todoName: string) {
    const todoList = todoLists[todoListTitle];
    if (!todoList) throw new Error(`todo list '${todoListTitle}' not found`);
    const todo = todoList.todos.find((todo) => todo.name === todoName);
    if (!todo) throw new Error(`todo '${todoName}' not found in list '${todoListTitle}'`);
    todo.done = !todo.done;
    return todo;
  }
}
