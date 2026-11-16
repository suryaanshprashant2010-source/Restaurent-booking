import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRoomBySlug } from '@/lib/data';

export default async function RoomDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) notFound();

  return (
    <section className="section">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="grid gap-4">
              {(room.image_urls?.length ? room.image_urls : ['placeholder']).map((_, i) => (
                <div key={i} className={`rounded-2xl bg-gradient-to-br from-forest-200 via-ivory-200 to-champagne-200 ${i===0?'h-80':'h-48'}`} aria-label={`${room.name} photograph ${i+1}`} />
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">{room.room_type}</p>
            <h1 className="mt-2 font-serif text-5xl text-forest">{room.name}</h1>
            <p className="mt-4 text-lg text-forest-700">{room.description}</p>
            {room.long_description && <p className="mt-4 text-forest-700">{room.long_description}</p>}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="card p-5"><div className="text-xs uppercase tracking-wide text-forest-500">Capacity</div><div className="mt-1 text-lg font-medium">{room.capacity_min} - {room.capacity_max} guests</div></div>
              <div className="card p-5"><div className="text-xs uppercase tracking-wide text-forest-500">Pricing</div><div className="mt-1 text-lg font-medium">EUR {(room.base_price_cents/100).toFixed(0)} base + EUR {(room.price_per_guest_cents/100).toFixed(0)}/guest</div></div>
              <div className="card p-5"><div className="text-xs uppercase tracking-wide text-forest-500">Deposit</div><div className="mt-1 text-lg font-medium">{room.deposit_cents ? `EUR ${(room.deposit_cents/100).toFixed(0)} optional` : 'Not required'}</div></div>
              <div className="card p-5"><div className="text-xs uppercase tracking-wide text-forest-500">Availability</div><div className="mt-1 text-lg font-medium">Check live availability online</div></div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h2 className="font-serif text-2xl">Facilities & equipment</h2>
                <ul className="mt-2 grid grid-cols-1 gap-2 text-sm text-forest-700 sm:grid-cols-2">{(room.facilities||[]).map(f => <li key={f}>- {f}</li>)}</ul>
              </div>
              <div>
                <h2 className="font-serif text-2xl">Accessibility</h2>
                <ul className="mt-2 space-y-1 text-sm text-forest-700">{(room.accessibility||[]).map(f => <li key={f}>- {f}</li>)}</ul>
              </div>
              <div>
                <h2 className="font-serif text-2xl">Food & beverage options</h2>
                <ul className="mt-2 space-y-1 text-sm text-forest-700">{(room.food_beverage_options||[]).map(f => <li key={f}>- {f}</li>)}</ul>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`/booking?room=${room.slug}`} className="btn-primary">Book this room</Link>
              <Link href="/rooms" className="btn-secondary">Back to rooms</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}