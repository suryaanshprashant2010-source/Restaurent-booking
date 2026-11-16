'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ConfirmationClient({ reference }: { reference: string }) {
  const sp = useSearchParams();
  const email = sp.get('email') || '';
  const token = sp.get('token') || '';
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(()=>{
    async function load(){
      if (!email || !token) return;
      const res = await fetch('/api/bookings/lookup', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ reference, email, token })});
      const json = await res.json();
      if (!res.ok) setError(json.error || 'Could not load reservation');
      else setData(json.reservation);
    }
    load();
  },[reference,email,token]);

  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">Booking Confirmation</p>
        <h1 className="mt-2 font-serif text-5xl text-forest">Reservation received</h1>
        <div className="card mt-8 p-8">
          <p className="text-forest-700">Thank you. Your reservation has been submitted.</p>
          <p className="mt-3 text-lg"><span className="font-medium">Booking reference:</span> <span className="font-mono text-forest">{reference}</span></p>
          {data ? (
            <dl className="mt-6 grid gap-3 text-sm text-forest-700 sm:grid-cols-2">
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Room</dt><dd className="font-medium">{data.rooms?.name}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Status</dt><dd className="font-medium capitalize">{String(data.status).replace('_',' ')}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Date</dt><dd className="font-medium">{data.reservation_date}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Time</dt><dd className="font-medium">{String(data.start_time).slice(0,5)} - {String(data.end_time).slice(0,5)}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Guests</dt><dd className="font-medium">{data.guests}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Total</dt><dd className="font-medium">EUR {(data.total_price_cents/100).toFixed(2)}</dd></div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-forest-700">{error || 'A confirmation email with full details and a secure management link has been sent (when email service is configured).'}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/my-reservations" className="btn-secondary">Manage my reservation</Link>
            <Link href="/" className="btn-primary">Return home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}