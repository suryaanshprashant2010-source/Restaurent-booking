'use client';
import { useMemo, useState } from 'react';
import type { Room } from '@/types';
import { RoomCard } from './RoomCard';

export function RoomsBrowser({ initialRooms }: { initialRooms: Room[] }) {
  const [guests, setGuests] = useState('');
  const [type, setType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const types = Array.from(new Set(initialRooms.map(r => r.room_type)));

  const filtered = useMemo(() => {
    return initialRooms.filter(r => {
      const g = guests ? Number(guests) : null;
      if (g && (g < r.capacity_min || g > r.capacity_max)) return false;
      if (type && r.room_type !== type) return false;
      if (maxPrice && r.base_price_cents > Number(maxPrice) * 100) return false;
      return true;
    });
  }, [initialRooms, guests, type, maxPrice]);

  return (
    <div>
      <div className="card mb-8 grid gap-4 p-5 md:grid-cols-4">
        <div>
          <label className="label">Number of guests</label>
          <input className="input" type="number" min={1} value={guests} onChange={e=>setGuests(e.target.value)} placeholder="e.g. 8" />
        </div>
        <div>
          <label className="label">Room type</label>
          <select className="input" value={type} onChange={e=>setType(e.target.value)}>
            <option value="">All types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Max base price (EUR)</label>
          <input className="input" type="number" min={0} value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="e.g. 300" />
        </div>
        <div className="flex items-end">
          <button className="btn-secondary w-full" onClick={()=>{setGuests('');setType('');setMaxPrice('');}}>Clear filters</button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="card p-8 text-forest-700">No rooms match your filters. {initialRooms.length === 0 ? 'Connect the database and seed rooms to display live availability.' : 'Try adjusting your criteria.'}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(room => <RoomCard key={room.id} room={room} />)}
        </div>
      )}
    </div>
  );
}