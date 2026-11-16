import Link from 'next/link';
import { getRooms } from '@/lib/data';
import { RoomCard } from '@/components/RoomCard';
import { siteConfig } from '@/lib/config';

export default async function HomePage() {
  const rooms = await getRooms();
  const featured = rooms.slice(0, 3);
  return (
    <>
      <section className="relative overflow-hidden bg-forest text-ivory">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,184,150,0.25),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(248,244,236,0.12),_transparent_35%)]" />
        <div className="container-page relative grid gap-10 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
          <div>
            <p className="eyebrow text-champagne-300">Private Dining</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight sm:text-6xl">Elegant private rooms for unforgettable gatherings</h1>
            <p className="mt-6 max-w-xl text-lg text-ivory/85">Celebrate milestones, host business dinners or gather loved ones in beautifully appointed private dining rooms with bespoke menus and attentive service.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/booking" className="btn-primary bg-champagne text-forest hover:bg-champagne-400">Book a Private Room</Link>
              <Link href="/rooms" className="btn-secondary border-ivory/40 text-ivory hover:text-white">Explore Our Rooms</Link>
            </div>
          </div>
          <div className="card border-white/10 bg-white/10 p-8 text-ivory backdrop-blur">
            <h2 className="font-serif text-3xl">Reserve with confidence</h2>
            <ul className="mt-5 space-y-3 text-sm text-ivory/85">
              <li>- Real-time availability and instant confirmation</li>
              <li>- Rooms for intimate dinners to grand celebrations</li>
              <li>- Tailored food and beverage experiences</li>
              <li>- Secure online booking and clear policies</li>
            </ul>
            <div className="mt-6 text-sm text-champagne-200">Opening hours: {siteConfig.openingHour} - {siteConfig.closingHour}</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Featured Rooms</p>
              <h2 className="mt-2 font-serif text-4xl text-forest">Spaces crafted for every occasion</h2>
            </div>
            <Link href="/rooms" className="btn-secondary hidden sm:inline-flex">View all rooms</Link>
          </div>
          {featured.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((room) => <RoomCard key={room.id} room={room} />)}
            </div>
          ) : (
            <div className="mt-10 card p-8 text-forest-700">
              <p className="font-medium">Rooms will appear here once the database is connected and seeded.</p>
              <p className="mt-2 text-sm">Configure Supabase environment variables and run supabase/schema.sql to enable live room listings and bookings.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}