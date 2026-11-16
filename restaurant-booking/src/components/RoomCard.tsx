import Link from 'next/link';
import type { Room } from '@/types';

export function RoomCard({ room }: { room: Room }) {
  return (
    <article className="card overflow-hidden transition duration-300 hover:-translate-y-1">
      <div className="h-52 bg-gradient-to-br from-forest-200 via-ivory-300 to-champagne-200 flex items-end p-4">
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-forest">{room.room_type}</span>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-2xl text-forest">{room.name}</h3>
        <p className="mt-2 text-sm text-forest-700">{room.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm text-forest-700">
          <div><dt className="text-xs uppercase tracking-wide text-forest-500">Capacity</dt><dd>{room.capacity_min}-{room.capacity_max} guests</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-forest-500">From</dt><dd>EUR {(room.base_price_cents/100).toFixed(0)}</dd></div>
        </dl>
        <div className="mt-5 flex gap-3">
          <Link href={`/rooms/${room.slug}`} className="btn-secondary">View Details</Link>
          <Link href={`/booking?room=${room.slug}`} className="btn-primary">Book</Link>
        </div>
      </div>
    </article>
  );
}