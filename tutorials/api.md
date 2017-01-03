# APIs without Models

If you don't want to use Models to consume APIs, you can still use the facilities provided by Premiere.

Setting static Api values.

```typescript
import {Api} from 'premiere';

Api.base = 'http://my-api.com';
Api.setJwtToken('token');
Api.setCsrfToken('token');
```

Setting api instance values. This way is very useful when you want to use multiple APIs.

```typescript
import {Api} from 'premiere';

let api = new Api({
    base: 'http://my-api.com'
});

// alternatively, you can use api.base = 'http://my-api.com'
api.setJwtToken('token');
api.setCsrfToken('token');
```

Making requests.

The `http` method returns an AxiosInstance. For more information please refer to the [axios documentation](https://github.com/mzabriskie/axios).

```typescript
api.http().get('url');
```
