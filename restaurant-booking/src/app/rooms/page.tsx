import { getRooms } from '@/lib/data';
import { RoomsBrowser } from '@/components/RoomsBrowser';

export const metadata = { title: 'Our Rooms' };

export default async function RoomsPage() {
  const rooms = await getRooms();
  return (
    <section className="section">
      <div className="container-page">
        <p className="eyebrow">Our Rooms</p>
        <h1 className="mt-2 font-serif text-5xl text-forest">Private dining rooms</h1>
        <p className="mt-4 max-w-2xl text-forest-700">Browse our collection of private rooms and find the perfect setting for your occasion.</p>
        <div className="mt-10">
          <RoomsBrowser initialRooms={rooms} />
        </div>
      </div>
    </section>
  );
}