import Link from 'next/link';

export default async function Home() {
  const data = await fetch('http://127.0.0.1:3068/messages', { cache: 'no-cache' }).then((res) =>
    res.json()
  );

  return (
    <div className="p-4">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <br />
      <Link className="text-blue-500" href="/improved">
        Go to Improved page
      </Link>
    </div>
  );
}
