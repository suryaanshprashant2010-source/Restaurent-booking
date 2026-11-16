import { getRooms } from '@/lib/data';
import { BookingFlow } from '@/components/BookingFlow';

export const metadata = { title: 'Online Booking' };

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ room?: string }> }) {
  const rooms = await getRooms();
  const sp = await searchParams;
  return (
    <section className="section">
      <div className="container-page">
        <p className="eyebrow">Online Booking</p>
        <h1 className="mt-2 font-serif text-5xl text-forest">Reserve your private room</h1>
        <p className="mt-4 max-w-2xl text-forest-700">Select a room, check live availability, and complete your reservation securely.</p>
        <div className="mt-10">
          <BookingFlow rooms={rooms} initialRoomSlug={sp.room || ''} />
        </div>
      </div>
    </section>
  );
}