import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-page max-w-2xl text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-3 font-serif text-5xl text-forest">We could not find that page</h1>
        <p className="mt-4 text-forest-700">The page you are looking for may have been moved or does not exist.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/" className="btn-primary">Return home</Link>
          <Link href="/rooms" className="btn-secondary">View rooms</Link>
        </div>
      </div>
    </section>
  );
}
