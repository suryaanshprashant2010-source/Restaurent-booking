'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function MyReservationsPage() {
  const sp = useSearchParams();
  const [reference, setReference] = useState(sp.get('reference') || '');
  const [email, setEmail] = useState(sp.get('email') || '');
  const [token, setToken] = useState(sp.get('token') || '');
  const [reservation, setReservation] = useState<any>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      const res = await fetch('/api/bookings/lookup', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ reference, email, token })});
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Lookup failed');
      setReservation(json.reservation);
    } catch (err:any) { setReservation(null); setError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(()=>{ if (sp.get('reference') && sp.get('email') && sp.get('token')) { lookup(); } },[]);

  async function manage(action: 'cancel'|'request_modification') {
    setError(''); setMessage('');
    const res = await fetch('/api/bookings/manage', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ reference, email, token, action, note })});
    const json = await res.json();
    if (!res.ok) setError(json.error || 'Request failed');
    else { setMessage(action==='cancel' ? 'Reservation cancelled.' : 'Modification request submitted. Our team will contact you.'); lookup(); }
  }

  return (
    <section className="section">
      <div className="container-page max-w-4xl">
        <p className="eyebrow">My Reservations</p>
        <h1 className="mt-2 font-serif text-5xl text-forest">Retrieve and manage your booking</h1>
        <p className="mt-4 text-forest-700">Use your booking reference, email address and the secure token from your confirmation email to view or manage your reservation.</p>

        <form onSubmit={lookup} className="card mt-8 grid gap-4 p-6 md:grid-cols-3">
          <div><label className="label">Booking reference</label><input className="input" value={reference} onChange={e=>setReference(e.target.value)} required /></div>
          <div><label className="label">Email address</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
          <div><label className="label">Secure token</label><input className="input" value={token} onChange={e=>setToken(e.target.value)} required placeholder="From confirmation email link" /></div>
          <div className="md:col-span-3"><button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Retrieving...' : 'Retrieve reservation'}</button></div>
        </form>

        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{message}</p>}

        {reservation && (
          <div className="card mt-8 p-8">
            <h2 className="font-serif text-3xl text-forest">Reservation details</h2>
            <dl className="mt-5 grid gap-3 text-sm text-forest-700 sm:grid-cols-2">
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Reference</dt><dd className="font-medium">{reservation.reference}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Status</dt><dd className="font-medium capitalize">{String(reservation.status).replace('_',' ')}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Room</dt><dd className="font-medium">{reservation.rooms?.name}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Guests</dt><dd className="font-medium">{reservation.guests}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Date</dt><dd className="font-medium">{reservation.reservation_date}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-forest-500">Time</dt><dd className="font-medium">{String(reservation.start_time).slice(0,5)} - {String(reservation.end_time).slice(0,5)}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-wide text-forest-500">Special requests / notes</dt><dd className="font-medium whitespace-pre-wrap">{reservation.special_requests || '-'}</dd></div>
            </dl>
            <div className="mt-8 border-t border-forest/10 pt-6">
              <h3 className="font-serif text-2xl">Request changes or cancel</h3>
              <p className="mt-2 text-sm text-forest-700">Cancellation and modifications are subject to our cancellation policy. Submitting a request will update your reservation status and notify our team.</p>
              <textarea className="input mt-4 min-h-24" placeholder="Describe the change you would like to request (date, time, guests, etc.)" value={note} onChange={e=>setNote(e.target.value)} />
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="btn-secondary" type="button" onClick={()=>manage('request_modification')}>Request modification</button>
                <button className="btn-primary bg-red-800 hover:bg-red-900" type="button" onClick={()=>manage('cancel')}>Cancel reservation</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}