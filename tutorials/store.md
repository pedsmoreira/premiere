# Customizing Stores

In most cases it' not necessary to do any customization, but if you need to, here's how you do it.

We're gonna take as example a Todo Store.

```typescript
import {Model, Store} from 'premiere';

class TodoStore extends Store {
    static setIndex: boolean = false; // Avoid caching on the index method
    
    constructor() {
        super(TodoModel);
    }
    
    search(query: string): Promise<Todo[]> {
        return this.index()({url: `search?q=${query}`});
    }
}

class TodoModel extends Model {
    static path: string = 'todos';
    static store: Store<TodoModel> = new TodoStore();

    name: string; 
    checked: boolean = false;
    
    search(): Promise<Todo[]> {
        return (this.store() as TodoStore).search(`name=${this.name}&checked=${this.checked}`);
    }
}
```

Using TodoStore directly

```typescript
let store = new TodoStore();
store.search('query'); // search?q=query
```

Using the store through the TodoModel

```typescript
let model = new TodoModel();
model.name = 'model';
model.checked = true;
model.search(); // search?q=name=model&checked=true
```

Optimally, if you wish to do simple configurations on the Store, you can do so through the static property
`storeProperties`. This next example does the same as the one above, but without declaring a Store class.

```typescript
import {Hash, Model} from 'premiere';

class TodoModel extends Model {
    static storeProperties: Hash<any> = {
        setIndex: false
    };
    
    name: string; 
    checked: boolean = false;
    
    search() {
        return this.store().index({url: `name=${this.name}&checked=${this.checked}`});
    }
}
```

Setting a custom base path to a Store:

```typescript
class TodoStore extends Store {
    static base = 'http://custom-base.com'
}
```

<div style="text-align: right; font-weight: bold;">
    <a href="./cache.md">Next: Working with Cache</a>
</div>
