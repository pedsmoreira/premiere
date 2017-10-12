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

We recommend the use with [TypeScript](http://typescriptlang.org/) or ECMAScript 6 (ES6).

## Website
For a better experience, please checkout the [Website](http://pedsmoreira.github.io/premiere)

## Workflow
![Workflow](assets/workflow.png)

** For more about how promises work, check out [Dave Atchley's article](http://www.datchley.name/es6-promises/)

## Features
- 100% Unit Tested
- Normalization
- Smart Caching
- Support to Foreign keys
- HTTP Header support _(frequently used with Authorization and CSRF token)_

## Installation

Using [npm](http://npmjs.com/):

```bash
npm install premiere --save
```

Using cdn:

```html
<script src="https://unpkg.com/premiere/dist/premiere.min.js"></script>
```

**Note:** You'll need a ES6 [polyfill](https://babeljs.io/docs/usage/polyfill/) on your build pipeline.

## Setup

This code is written in [TypeScript](http://typescriptlang.org/).

```typescript
import {Api, api, Model} from 'premiere';

Api.base = 'http://rest.learncode.academy/api/YOUR_NAME_HERE/';

/*
 * Using API directly
 */

api.http().get('albums'); // GET http://rest.learncode.academy/api/YOUR_NAME_HERE/albums
api.http().post('albums'); // POST http://rest.learncode.academy/api/YOUR_NAME_HERE/albums

/*
 * Using Models
 */

class Album extends Model {
    static path = 'albums';
    
    id: number;
    name: string;
}

Album.all(); // GET http://rest.learncode.academy/api/YOUR_NAME_HERE/albums
Album.find(1); // GET http://rest.learncode.academy/api/YOUR_NAME_HERE/albums/1
Album.save({name: 'new album'});// POST http://rest.learncode.academy/api/YOUR_NAME_HERE/albums
``` 

## Tutorials

The tutorials are written in [TypeScript](http://typescriptlang.org/). 

- [Working with Models](./tutorials/model.md)
- [Working with Foreign Keys](./tutorials/model-fk.md)
- [Customizing Stores](./tutorials/store.md)
- [Working with Cache](./tutorials/cache.md)
- [APIs without Models](./tutorials/api.md)

## Documentation

Check out the full [Documentation](http://pedsmoreira.github.io/premiere/documentation).

## Examples
- [Book List](http://jsfiddle.net/pedsmoreira/fqLuvjr1/) _(ES6 - JSFiddle)_

## Projects
- [Premiere Player](https://github.com/pedsmoreira/premiere-player) _(ES6 + React + MobX)_

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
    
- V0.2
    

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
