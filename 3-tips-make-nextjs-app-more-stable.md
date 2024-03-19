# 3 Tips to Make Your Next.js App More Stable

Since Next.js introduced the `App Router` feature, it provides `React Server Components` (`RSC`).

`RSC` allows your app to render on the server-side, returning static HTML to the browser for faster initial load times.

Here's an example: **Creating a page to render data from an API**

```ts
// app/page.tsx
export default async function HelloPage() {
  const data = await fetch('http://127.0.0.1:3068/messages', {cache: 'no-cache'}).then((res) =>
    res.json()
  );

  return <div>{JSON.stringify(data)}</div>
}
```

> **Note**: `{cache: 'no-cache'}` is added to disable caching for testing purposes.

The concern here is: what happens if the API fetch encounters an error? This could lead to a crashed page.

![error](error.png)

The example code uses Express.js to simulate an API:

```ts
import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hi');
});

app.get('/messages', (req, res) => {
  const isEven = Math.round(Math.random() * 19) % 2 === 0;
  if (isEven) {
    res.send([
      { id: 1, text: 'Foobar' },
      { id: 1, text: 'Some content' },
    ]);
  } else {
    res.status(500).send({
      msg: 'some error happend',
    });
  }
});

app.listen(3068, () => {
  console.log(`Server listening at: http://127.0.0.1:3068`);
});
```

Here's how we can improve this scenario:

1. **Implement Error Retries:** If the API call fails, we can retry the request a few times before giving up.
2. **Cache Data:** When the API request is successful, cache the data. If retries still fail, use the cached data to prevent a completely broken page.
3. **Dedupe Requests:** Avoid making unnecessary redundant requests. This prevents multiple identical requests from being sent simultaneously on the fly.

These functionalities can be achieved using libraries like `axios` with its third-party plugins or a library specifically designed for these purposes, such as [`xior`](https://npmjs.org/xior).

In this case, we'll use [`xior`](https://npmjs.org/xior). **xior** offers a similar API to `axios` and leverages the built-in `fetch` API.

**Install `xior`**:

```sh
npm install xior

# or pnpm install
pnpm install xior
```

Create an `app/http.ts` file to configure **xior** with its built-in plugins:

```ts
// app/http.ts
import xior from 'xior';
import errorRetryPlugin from 'xior/plugins/error-retry';
import errorCachePlugin from 'xior/plugins/error-cache';
import dedupeRequestPlugin from 'xior/plugins/dedupe';

export const http = xior.create({
  baseURL: 'http://127.0.0.1:3068/',
});

http.plugins.use(
  errorRetryPlugin({
    retryTimes: 2,
    retryInterval(count) {
      return count * 250;
    },
    onRetry(config, error, count) {
      console.log(`${config?.method} ${config?.url} retry ${count}`);
    },
  })
);
http.plugins.use(errorCachePlugin());
http.plugins.use(dedupeRequestPlugin());
```

Create a new page `app/improved/page.tsx` that utilizes the `http.ts` instance:

```tsx
// app/improved/page.tsx
import { http } from '../http';

export default async function ImprovedHelloPage() {
  const { data, fromCache, error } = await http.get('/messages', { cache: 'no-cache' });

  return (
    <div>
      {fromCache ? (
        <>
          <div className="p-2 text-yellow-600 bg-yellow-300">
            The data from cache, error: {error?.message}
          </div>
          <hr />
        </>
      ) : null}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

Even if the API call fails and retries are unsuccessful, the page won't crash. Instead, you can show an error message and possibly display cached data or a fallback message. This ensures a better user experience and avoids showing a broken page.

![xior plugins](ok.png)

Thank you for reading these little tips. Here's the **Example Source Code**: https://github.com/suhaotian/3-tips-make-next-more-stable-demo
