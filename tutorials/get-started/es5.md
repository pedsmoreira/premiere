# ES5 (no compilation needed)

To start using the library, add the script tag to your html

```html
<script src="https://unpkg.com/premiere/dist/premiere.min.js"></script>
```

## Set Api base path
```javascript
Premiere.Api.base = 'http://my-api.com'
```

## First model "class"
```javascript
var Book = Object.assign(Premiere.Model, {
  path: 'books',
});

// GET http://my-api.com/books/1
Book.get(1).then(function(book) {
  console.log(book); // {name: "Harry Potter and the sorcerer Stone", age: 12} 
});

// POST http://my-api.com/book with data: {name: 'New book'}
Book.save({name: 'New book'})
```

## Custom store
```javascript
var bookStore = new Premiere.Store({
  model: Book,
  index: function() {
    alert('trying to index :O')
  }
});

Book.store = bookStore;
Bool.all(); // The model will will the Store, so the alert will show up
``` 

## Check out more

Check out this [Book List example live on JsFiddle](http://jsfiddle.net/pedsmoreira/Lt2ehe5w/)

http://jsfiddle.net/pedsmoreira/Lt2ehe5w/
