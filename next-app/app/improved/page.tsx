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
