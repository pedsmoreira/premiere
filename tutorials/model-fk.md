# Working with Foreign Keys

Premiere provide methods to facilitate working with foreign keys.

To explain how to to work with FKs, let's use as example a list of todos. 

```typescript
import {Model} from 'premiere';

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
    static users(listId: number): Promise<User[]> { // The static method is just an alternative way
        return this.belongsToMany(User, listId);
    }
    
    // GET /lists/:id/status
    status(): Promise<Status> { // Notice promise promise Status, not an array
        return this.hasOne(Status);
    }
    
    // GET /lists/:id/status
    static status(listId: number): Promise<Status> { // Notice promise promise Status, not an array
        return this.hasOne(Status, listId);
    }
    
    // GET /lists/:id/todos
    hasMany(): Promise<Todo[]> { // Notice the promise Todo[], an array  
        return this.hasMany(Todo);
    }
    
    // GET /customUrl/:id
    static hasMany(listId: number): Promise<Todo[]> {  
        return this.hasMany(Todo, null, {url: `customUrl/${listId}`});
    }
}
```

<div style="text-align: right; font-weight: bold;">
    <a href="./store.md">Next: Customizing Stores</a>
</div>
