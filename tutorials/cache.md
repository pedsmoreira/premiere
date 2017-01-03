# Working with Cache

Just like working with Stores, in most of the cases the default configuration is enough,
but if you need to, here's how you do it.

Though Store. Optionally, the properties be `static`.

```typescript
import {Store, Hash} from 'premiere';

class TodoStore extends Store {
    base: string = 'http://store-base.com';
    headers: Hash<string> = {customHeader: 'header'};
    useCache: boolean = false;
    usePromiseCache = false;
}
```

Though Model

```typescript
import {Model, Hash} from 'premiere';

class TodoModel extends Model {
    static storeProperties: Hash<any> = {
        base: 'http://store-base.com',
        headers: 'http://store-base.com',
        useCache: false,
        usePromiseCache: false
    };
}
```

<div style="text-align: right; font-weight: bold;">
    <a href="./api.md">Next: APIs without Models</a>
</div>
