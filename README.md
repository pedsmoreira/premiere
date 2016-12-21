# Premiere

[![npm version](https://img.shields.io/npm/v/premiere.svg)](https://www.npmjs.org/package/premiere)
[![Code Climate](https://codeclimate.com/github/pedsmoreira/premiere/badges/gpa.svg)](https://codeclimate.com/github/pedsmoreira/premiere)

Easy and powerful JS ORM for Restful clients

`TODO - Add flow image`

## Features
- Works very nicely with [TypeScript](http://typescriptlang.org/)
- Easy configuration
- Model normalization and denormalization
    Working with classes is a lot easier than with simple objects
- Caching
    - Objects: normalized data with all fields
    - Lists: list of objects not normalized by default.
    
        `It's possible to store the list elements into the objects cache`
    - Promises: avoid making the same request to fetch data twice in a row
- Nested resources support

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

## Example

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

With MobX

```js
// TODO
```

## Typescript
Premiere is written in Typescript and it includes [TypeScript](http://typescriptlang.org/) definitions

```typescript
import * as Premiere from 'premiere';
```

## Credits
Premiere is inspired by [MobX](http://mobxjs.github.io/) and [axios](https://github.com/mzabriskie/axios).

Their workflow and easiness of use are an inspiration for building simple and powerful libraries.

## License
MIT
