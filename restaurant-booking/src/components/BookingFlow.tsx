'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Room } from '@/types';

function addMinutes(t: string, mins: number) {
  const [h,m]=t.split(':').map(Number); const total=h*60+m+mins; const hh=String(Math.floor(total/60)).padStart(2,'0'); const mm=String(total%60).padStart(2,'0'); return `${hh}:${mm}`;
}

export function BookingFlow({ rooms, initialRoomSlug }: { rooms: Room[]; initialRoomSlug?: string }) {
  const router = useRouter();
  const [roomSlug, setRoomSlug] = useState(initialRoomSlug || rooms[0]?.slug || '');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState<number>(2);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotInfo, setSlotInfo] = useState<string>('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(120);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [payDeposit, setPayDeposit] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const room = useMemo(()=>rooms.find(r=>r.slug===roomSlug), [rooms, roomSlug]);
  const endTime = useMemo(()=> startTime ? addMinutes(startTime, duration) : '', [startTime, duration]);
  const totalCents = useMemo(()=> room ? room.base_price_cents + room.price_per_guest_cents * (guests||0) : 0, [room, guests]);
  const today = new Date().toISOString().slice(0,10);

  useEffect(()=>{ if (initialRoomSlug) setRoomSlug(initialRoomSlug); },[initialRoomSlug]);
  useEffect(()=>{
    if (room) {
      setGuests(g => Math.min(Math.max(g || room.capacity_min, room.capacity_min), room.capacity_max));
    }
  },[roomSlug]);

  useEffect(()=>{
    async function load() {
      if (!roomSlug || !date || !guests) { setSlots([]); return; }
      if (room && (guests < room.capacity_min || guests > room.capacity_max)) { setSlots([]); setSlotInfo('Guest count outside room capacity.'); return; }
      setLoadingSlots(true); setSlotInfo('');
      try {
        const res = await fetch(`/api/availability?room=${encodeURIComponent(roomSlug)}&date=${encodeURIComponent(date)}&guests=${guests}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load availability');
        setSlots(data.slots || []);
        setDuration(data.durationMinutes || 120);
        if ((data.slots||[]).length === 0) setSlotInfo(data.reason || 'No available time slots for this date. Please try another date.');
      } catch (e:any) { setSlots([]); setSlotInfo(e.message); }
      finally { setLoadingSlots(false); }
    }
    load();
  },[roomSlug,date,guests,room]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!room) return setError('Please select a room.');
    if (!date || !startTime || !endTime) return setError('Please select a date and time slot.');
    if (guests < room.capacity_min || guests > room.capacity_max) return setError(`Guests must be between ${room.capacity_min} and ${room.capacity_max}.`);
    if (!name || !email || !phone) return setError('Please complete your contact information.');
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
        roomSlug, date, startTime, endTime, guests, name, email, phone, specialRequests, payDeposit
      })});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      const token = data.manageToken ? `&token=${encodeURIComponent(data.manageToken)}` : '';
      router.push(`/booking/confirmation/${data.reservation.reference}?email=${encodeURIComponent(email)}${token}`);
    } catch (e:any) {
      setError(e.message || 'Unable to complete booking.');
    } finally { setSubmitting(false); }
  }

  if (rooms.length === 0) {
    return <div className="card p-8 text-forest-700">Booking is unavailable until the database is connected and rooms are seeded. Please configure Supabase and run <code>supabase/schema.sql</code>.</div>;
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="font-serif text-2xl text-forest">1. Choose your room</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Private dining room</label>
              <select className="input" value={roomSlug} onChange={e=>{setRoomSlug(e.target.value); setStartTime('');}}>
                {rooms.map(r => <option key={r.slug} value={r.slug}>{r.name} ({r.capacity_min}-{r.capacity_max} guests)</option>)}
              </select>
            </div>
            <div>
              <label className="label">Reservation date</label>
              <input className="input" type="date" min={today} value={date} onChange={e=>{setDate(e.target.value); setStartTime('');}} required />
            </div>
            <div>
              <label className="label">Number of guests</label>
              <input className="input" type="number" min={room?.capacity_min||1} max={room?.capacity_max||200} value={guests} onChange={e=>setGuests(Number(e.target.value))} required />
              {room && <p className="mt-1 text-xs text-forest-500">Capacity: {room.capacity_min}-{room.capacity_max} guests</p>}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-serif text-2xl text-forest">2. Select an available time</h2>
          {!date ? <p className="mt-3 text-sm text-forest-700">Choose a date to view available time slots.</p> : loadingSlots ? <p className="mt-3 text-sm">Checking availability...</p> : slots.length ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {slots.map(s => (
                <button type="button" key={s} onClick={()=>setStartTime(s)} className={`rounded-xl border px-3 py-2 text-sm transition ${startTime===s?'border-forest bg-forest text-ivory':'border-forest/20 bg-white hover:border-champagne-600'}`}>
                  {s}
                </button>
              ))}
            </div>
          ) : <p className="mt-3 text-sm text-forest-700">{slotInfo || 'No available slots.'}</p>}
          {startTime && <p className="mt-4 text-sm text-forest-700">Selected: <strong>{startTime} - {endTime}</strong> ({duration} minutes)</p>}
        </div>

        <div className="card p-6">
          <h2 className="font-serif text-2xl text-forest">3. Your details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="label">Full name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} required /></div>
            <div><label className="label">Email address</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            <div><label className="label">Telephone</label><input className="input" value={phone} onChange={e=>setPhone(e.target.value)} required /></div>
            <div className="sm:col-span-2"><label className="label">Special requests</label><textarea className="input min-h-28" value={specialRequests} onChange={e=>setSpecialRequests(e.target.value)} placeholder="Dietary requirements, celebrations, seating preferences..." /></div>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="card p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl text-forest">Booking summary</h2>
          <dl className="mt-4 space-y-3 text-sm text-forest-700">
            <div className="flex justify-between gap-4"><dt>Room</dt><dd className="font-medium text-right">{room?.name || '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Date</dt><dd className="font-medium">{date || '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Time</dt><dd className="font-medium">{startTime ? `${startTime} - ${endTime}` : '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Guests</dt><dd className="font-medium">{guests || '-'}</dd></div>
            <div className="flex justify-between gap-4 border-t border-forest/10 pt-3"><dt>Total (calculated)</dt><dd className="font-semibold text-forest">EUR {(totalCents/100).toFixed(2)}</dd></div>
          </dl>
          {room && room.deposit_cents > 0 && (
            <label className="mt-4 flex items-start gap-2 text-sm text-forest-700">
              <input type="checkbox" className="mt-1" checked={payDeposit} onChange={e=>setPayDeposit(e.target.checked)} />
              <span>Request deposit option (EUR {(room.deposit_cents/100).toFixed(2)}). Deposit payment can be completed securely when Stripe is configured; reservation will be marked pending deposit.</span>
            </label>
          )}
          <p className="mt-4 text-xs text-forest-500">By confirming, you agree to our terms, cancellation policy and privacy practices. Your information is validated server-side and stored securely.</p>
          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" className="btn-primary mt-5 w-full" disabled={submitting || !startTime}>{submitting ? 'Confirming...' : 'Confirm reservation'}</button>
        </div>
      </aside>
    </form>
  );
}