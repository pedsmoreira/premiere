## Working with Foreign Keys

Premiere provide methods to facilitate working with foreign keys.

To explain how to to work with FKs, let's use as example a list of todos. 

```typescript
import { Model } from 'premiere';

// Models
import Group from './Group';
import Todo from './Todo';
import User from './User';
import Status from './Status';

export default class List extends Model {
    static path: string = 'lists';
    
    id: number;
    group_id: number;
    
    // GET /groups/:group_id
    group(): Promise<Group> {
        return this.belongsTo(Group);
    }
    
    // GET /lists/:id/users
    users(): Promise<User[]> {
        return this.belongsToMany(User); 
    }
    
    // GET /lists/:id/users
    static users(listId: number): Promise<User[]> {
        return this.belongsToMany(User, listId);
    }
    
    // GET /lists/:id/status
    status(): Promise<Status> {
        return this.hasOne(Status);
    }
    
    // GET /lists/:id/status
    static status(listId: number): Promise<Status> {
        return this.hasOne(Status, listId);
    }
    
    // GET /lists/:id/todos
    todos(): Promise<Todo[]> { // Notice the promise Todo[], an array  
        return this.hasMany(Todo);
    }
    
    // GET /customUrl/:id
    static todos(listId: number): Promise<Todo[]> {  
        return this.hasMany(Todo, listId, {url: `customUrl/${listId}`});
    }
}
```

* * *

#### [Next: Customizing Stores](./store.md)
