# Tutorials

Most of these tutorials use ES6.

**If you're just getting started, I recommend you the take the [Tour](./tour)**

## Get Started
- [Tour](./get-started/tour)
- [Todo List](./get-started/todo)

Premiere also supports ES5 and Typescript

- [ES5](./get-started/es5) _(no compilation needed)_
- [Typescript](./get-started/typescript)

## Model
Models list the properties and create shortcuts to make your life easier.
Most of the time, you'll only need to create Models; the stores will be handled by themselves.

- [New model](./model/new-model)
- [Fetch](./model/fetch)
- [Save](./model/save)
- [Foreign Keys](./model/foreign-keys)
- [Act](./model/act)
- [Destroy](./model/destroy)

## Store
Stores are the soul of your API client. They define how to communicate with the server.

- [Custom Store](./store/custom-store)
- [Custom Store from Model](./store/custom-store-from-model)
- [Permissions](./store/permissions)

## Api
`Store` extend `Api` to have access to caching and request control _(header and path)_.

- [Cache](./api/cache)
- [Promise Cache](./api/promise-cache)
- [JWT Token](./api/jwt-token)
- [CSRF Token](./api/csrf-token)
- [Header Parameters](./api/header-parameters)
