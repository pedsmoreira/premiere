# Get Started

## Installation

### With ES6 or Typescript

Add Premiere package:

```bash
$ npm install --save premiere
```

Import it:

```typescript
import {Api, Model, Store} from 'premire';

import {Api} from 'premiere';
Api.base = 'http://my-api.com';
```

**Note:** Have in mind that you'll need a [polyfill](https://babeljs.io/docs/usage/polyfill/)

### With ES5 _(no compilation needed)_

Add Premiere script

```html
<script src="https://unpkg.com/premiere/dist/premiere.min.js"></script>
```

Create classes with Object.assign

```javascript
Premiere.Api.base = 'http://my-api.com';

var Book = Object.assign(Premiere.Model, {
  path: 'books',
});
```

## Check out more

Now that you've setup your environment, look how to **[Work with Models](./model)**
