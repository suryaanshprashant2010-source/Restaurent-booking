import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { siteConfig } from '@/lib/config';
import { buildSlots, intervalsOverlap, timeToMinutes } from '@/lib/booking/utils';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('room');
    const date = searchParams.get('date');
    const guests = Number(searchParams.get('guests') || '0');
    if (!slug || !date) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { data: room, error } = await supabase.from('rooms').select('*').eq('slug', slug).eq('is_active', true).single();
    if (error || !room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    if (guests && (guests < room.capacity_min || guests > room.capacity_max)) {
      return NextResponse.json({ slots: [], reason: 'Guest count outside room capacity' });
    }

    const { data: reservations } = await supabase
      .from('reservations')
      .select('start_time,end_time,status')
      .eq('room_id', room.id)
      .eq('reservation_date', date)
      .in('status', ['pending_deposit','confirmed','modification_requested']);

    const blocked = (reservations || []).map((r: any) => ({
      start: timeToMinutes(String(r.start_time).slice(0,5)) - room.preparation_minutes,
      end: timeToMinutes(String(r.end_time).slice(0,5)) + room.cleaning_minutes,
    }));

    const step = siteConfig.slotMinutes;
    const all = buildSlots(siteConfig.openingHour, siteConfig.closingHour, step);
    const duration = 120;
    const slots = all.filter((start: string) => {
      const s = timeToMinutes(start);
      const e = s + duration;
      if (e > timeToMinutes(siteConfig.closingHour)) return false;
      return !blocked.some((b: any) => intervalsOverlap(s, e, b.start, b.end));
    });
    return NextResponse.json({ slots, durationMinutes: duration });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to check availability' }, { status: 500 });
  }
}
