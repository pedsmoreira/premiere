# Tutorials

Most of these tutorials use ES6.

**If you're just getting started, I recommend you the take the [Tour](./tour)**

## Get Started
- [Tour](./tour)
- [Todo List](./todo)

Premiere also supports ES5 and Typescript

- [ES5](./es5) _(no compilation needed)_
- [Typescript](./typescript)

## Model
Models list the properties and create shortcuts to make your life easier.
Most of the time, you'll only need to create Models; the stores will be handled by themselves.

- [Create model](./create-model)
- [Fetch](./fetch)
- [Save](./save)
- [Foreign Keys](./foreign-keys)
- [Act](./act)
- [Destroy](./destroy)

## Store
Stores are the soul of your API client. They define how to communicate with the server.

- [Custom Store](./custom-store)
- [Custom Store from Model](./custom-store-from-model)
- [Method Permission](./method-permission)

## Api
`Store` extend `Api` to have access to caching and request control _(header and path)_.

- [Cache](./cache)
- [Promise Cache](./promise-cache)
- [JWT Token](./jwt-token)
- [CSRF Token](./csrf-token)
- [Header Parameters](./header-parameters)
