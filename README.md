# ![Premiere](./assets/logo.png)

[![npm version](https://img.shields.io/npm/v/premiere.svg)](https://www.npmjs.org/package/premiere)
[![Build Status](https://travis-ci.org/pedsmoreira/premiere.svg?branch=master)](https://travis-ci.org/pedsmoreira/premiere)
[![Code Climate](https://codeclimate.com/github/pedsmoreira/premiere/badges/gpa.svg)](https://codeclimate.com/github/pedsmoreira/premiere)
[![Test Coverage](https://codeclimate.com/github/pedsmoreira/premiere/badges/coverage.svg)](https://codeclimate.com/github/pedsmoreira/premiere/coverage)

A simple way to consume APIs with Javascript.

Premiere helps you reducing the amount of boilerplate necessary to consume APIs. Here's an example of how it looks like:

```typescript
const todoList = new TodoList();
todoList.title = 'Daily routine';
todoList.save();

// Get user by todo list
const user = await todoList.user;

// Get items from todo list
const items = await todoList.items;

// List all todo lists by user
const lists = TodoList.byUser(1);
```

- Friendly syntax, inspired by [Eloquent](https://laravel.com/docs/master/eloquent) (Laravel) and [ActiveRecord](http://guides.rubyonrails.org/active_record_basics.html) (Rails)
- Normalization
    - Normalize data coming from the API
    - Denormalize data before sending to the API
- Smart Caching to speed up your app
    - Automatic request and result caching
    - Automatic cache removal (for lists) upon saving a record  
- Support to Foreign keys
- Support to HTTP Header settings
    - JWT token helper
    - CSRF token helper

## Workflow
![Workflow](assets/workflow.png)

** For more about how promises work, check out [Dave Atchley's article](http://www.datchley.name/es6-promises/)

## Installation

Using npm:

```bash
npm install premiere --save
```

## Getting Started

### Setting API url

```typescript
import { api };
api.base = 'http://api.com'
 ```

### Creating a new model

```typescript
import { api, Model } from 'premiere';
import User from './User';
import TodoItem from './TodoItem';

// Set your api base
api.base = 'http://my-api.com';

// Define your model
export default class TodoList extends Model {
  path = 'todo-item';
  
  user_id: number;
  title: string;
  created_at: Date;
  
  get user(): Promise<User> {
    return this.belongsTo(User);
  }
  
  static byUser(key: number) {
    return this.belongsTo(User, key);
  }
  
  get items(): Promise<TodoItem> {
    return this.hasMany(TodoItem);
  }
  
  normalizeCreatedAt(value: string): Date {
    return new Date(value);
  }
  
  denormalizeCreatedAt(value: Date): string {
    return value.toISOString();
  }
}

// Create new todo list
const todoList = new TodoList();
todoList.user_id = 1;
todoList.title = 'Daily routine';
todoList.save();

// Get user by todo list
const user = await todoList.user;

// Get items from todo list
const items = await todoList.items;

// List all todo lists by user
const lists = TodoList.byUser(1);
```

## Tutorials

The tutorials are written in [TypeScript](http://typescriptlang.org/). 

- [Working with Models](./tutorials/model.md)
- [Working with Foreign Keys](./tutorials/model-fk.md)

## Dependencies

- [axios](https://github.com/mzabriskie/axios) for handling HTTP Requests.

## Resources

- [Contributing Guide](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

- The logo was created by Yannick Lung and can be found [here](https://www.iconfinder.com/icons/183243/cover_flow_icon).

### Articles

- V0.1
    - https://medium.com/@pedsmoreira/consuming-restful-apis-with-premiere-ae712d1bc935#.ki5e8biu3
    - https://medium.com/@pedsmoreira/from-0-to-100-coverage-real-quick-d71dda7069e5#.sceucnhmf
    

## Motivation

Premiere is inspired by
[Laravel](https://laravel.com/)
([Eloquent](https://laravel.com/docs/master/eloquent)) and
[Rails](http://rubyonrails.org/)
([Active Record](http://guides.rubyonrails.org/active_record_basics.html)).

Because of frameworks like these, building Restful APIs is a much smoother path.

The goal of Premiere is to provide the same facility and power that these libraries provide, just this time on the client side.

## License

[MIT](./LICENSE)
