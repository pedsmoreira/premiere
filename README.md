# Premiere

[![npm version](https://img.shields.io/npm/v/premiere.svg)](https://www.npmjs.org/package/premiere)
[![Build Status](https://travis-ci.org/pedsmoreira/premiere.svg?branch=master)](https://travis-ci.org/pedsmoreira/premiere)
[![Code Climate](https://codeclimate.com/github/pedsmoreira/premiere/badges/gpa.svg)](https://codeclimate.com/github/pedsmoreira/premiere)
[![Test Coverage](https://codeclimate.com/github/pedsmoreira/premiere/badges/coverage.svg)](https://codeclimate.com/github/pedsmoreira/premiere/coverage)

Javascript ORM for consuming Restful APIs.

Premiere is standalone _(independent of framework)_, so you can use it with your favorite library/framework, be it
[MobX](https://mobxjs.github.io/mobx/)
[React](https://facebook.github.io/react/),
[Angular](https://angularjs.org/),
[VueJS](https://vuejs.org/),
[jQuery](https://jquery.com/),
[Redux](http://redux.js.org/). You name it!

#### Quick Links
- [Website](http://pedsmoreira.github.io/premiere)
- [Documentation](http://pedsmoreira.github.io/premiere/docs)

## Features
- Works very nicely with [TypeScript](http://typescriptlang.org/) and ES6
- Easy configuration
- Model normalization and denormalization
- Caching
- Foreign keys
- HTTP Header support _(frequently used with Authorization and CSRF token)_
- 100% Unit Tested

## Workflow
![Workflow](assets/workflow.png)

** For more about how promises work, check out [Dave Atchley's article](http://www.datchley.name/es6-promises/)

## Installing

Using [npm](http://npmjs.com/):

```bash
$ npm install premiere --save
```

Using [yarn](https://yarnpkg.com/):

```bash
$ yarn add premiere
```

Using [bower](https://bower.io/):

```bash
$ bower install premiere --save
```

Using cdn:

```html
<script src="https://unpkg.com/premiere/dist/premiere.min.js"></script>
```

## Quick Samples

Creating a new Model
 
```js
// TODO
```

Creating a custom Store

```js
// TODO
```

Creating an API

```js
// TODO
```

Working with the cache

```js
// TODO
```

Persisting the **index** result

```js
// TODO
```

With MobX

```js
// TODO
```

## Examples
- [Premiere Player](https://github.com/pedsmoreira/premiere-player) 

## Inspiration
Premiere is inspired by [Laravel](https://laravel.com/)
([Eloquent](https://laravel.com/docs/master/eloquent)) and
[Rails](http://rubyonrails.org/)
([Active Record](http://guides.rubyonrails.org/active_record_basics.html)).

Because of frameworks like this, it's much simpler to build Restful APIs.
The goal of Premiere is to provide the same facility and power that these libraries provide on the server side.  

## Dependencies
Premiere uses [axios](https://github.com/mzabriskie/axios) for handling HTTP Requests.

## License
MIT
