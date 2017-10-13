## Working with models

Lets take for example a Todo Model. It's gonna have three fields, `name`, `checked` and `date`.

The `date` field is a `Date` but is sent and received from the Api as a timestamp number, so we are going to normalize and denormalize it. 

```typescript
import { Model } from 'premiere';

class Todo extends Model {
  static path: string = 'todos'
  
  name: string; 
  checked: boolean = false;
  date: Date = new Date();
  
  // The normaliztion method can be snake_case
  static normalize_date(timestamp: number): Date {
      return new Date(timestamp);
  }
  
  // It can be camelCase as well
  static denormalizeDate(date: Date): number {
      return date.getTime();
  }
}
```

### Fetching todos

```typescript
// GET todos/
Todo.all().then((todos: Todo[]) => {
  console.log(todos); // [Todo, Todo]
})
```

### Fetching todo

```typescript
// GET todos/:id
Todo.find(1).then((todo: Todo) => {
  console.log(todo); // Todo
})
```

### Fetching a todo by parameter

```typescript
// GET todos/name/Item
Todo.where('name', 'Item').then((todo: Todo) => {
  console.log(todo); // Todo
})
```

### Creating a new todo

```typescript
// POST todos/
let todo = new Todo();
todo.name = 'My own todo';
todo.save().then((todo: Todo) => {
    console.log(todo); // Todo
);

// OR

Todo.save({name: 'My own todo'}).then((todo: Todo) => {
    console.log(todo); // Todo
);
```

### Updating a todo

```typescript
// PUT todos/:id
todo.name = 'New name';
todo.save().then((todo: Todo) => {
    console.log(todo); // Todo
);
```

### Deleting a todo

```typescript
// DELETE todos/:id
todo.destroy(() => {
    console.log('Todo destroyed');
});
```

### Reloading a todo

```typescript
// GET todos/:id
todo.name = 'new name';
todo.reload((todo: Todo) => {
    console.log(todo); // Todo with name 'My own todo'
});
```

### Custom action

```typesript
// POST todos/deleteAll 
Todo.act('deleteAll', {method: 'post'})
```

* * *

#### [Next: Working with Foreign Keys](./model-fk.md)
