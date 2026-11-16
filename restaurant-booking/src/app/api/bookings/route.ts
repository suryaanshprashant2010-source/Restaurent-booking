import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { bookingSchema } from '@/lib/booking/validation';
import { calculateTotalCents, generateManageToken, generateReference, hashToken, intervalsOverlap, isWithinOpeningHours, timeToMinutes } from '@/lib/booking/utils';
import { siteConfig } from '@/lib/config';
import { sendConfirmationEmail } from '@/lib/email';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const rl = rateLimit(`booking:${getClientIp(req)}`, 10, 60_000);
    if (!rl.ok) return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    const json = await req.json();
    const parsed = bookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid booking data', details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    if (!isWithinOpeningHours(data.startTime, data.endTime, siteConfig.openingHour, siteConfig.closingHour)) {
      return NextResponse.json({ error: 'Selected time is outside opening hours' }, { status: 400 });
    }
    if (timeToMinutes(data.endTime) - timeToMinutes(data.startTime) < 60) {
      return NextResponse.json({ error: 'Reservation must be at least 60 minutes' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: room, error: roomErr } = await supabase.from('rooms').select('*').eq('slug', data.roomSlug).eq('is_active', true).single();
    if (roomErr || !room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

    if (data.guests < room.capacity_min || data.guests > room.capacity_max) {
      return NextResponse.json({ error: Guest count must be between  and  }, { status: 400 });
    }

    // Recheck availability including preparation/cleaning intervals
    const { data: existing } = await supabase
      .from('reservations')
      .select('start_time,end_time,status')
      .eq('room_id', room.id)
      .eq('reservation_date', data.date)
      .in('status', ['pending_deposit','confirmed','modification_requested']);
    const s = timeToMinutes(data.startTime) - room.preparation_minutes;
    const e = timeToMinutes(data.endTime) + room.cleaning_minutes;
    const conflict = (existing || []).some((r: any) => intervalsOverlap(s, e, timeToMinutes(String(r.start_time).slice(0,5)), timeToMinutes(String(r.end_time).slice(0,5))));
    if (conflict) return NextResponse.json({ error: 'This time slot is no longer available' }, { status: 409 });

    const total = calculateTotalCents(room.base_price_cents, room.price_per_guest_cents, data.guests);
    const reference = generateReference();
    const manageToken = generateManageToken();
    const manageHash = hashToken(manageToken);
    const status = data.payDeposit && room.deposit_cents > 0 ? 'pending_deposit' : 'confirmed';

    const { data: inserted, error: insErr } = await supabase.from('reservations').insert({
      reference,
      room_id: room.id,
      reservation_date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      guests: data.guests,
      customer_name: data.name,
      customer_email: data.email.toLowerCase(),
      customer_phone: data.phone,
      special_requests: data.specialRequests || null,
      total_price_cents: total,
      deposit_paid_cents: 0,
      status,
      manage_token_hash: manageHash,
    }).select('id,reference,status,total_price_cents').single();

    if (insErr) {
      if (String(insErr.message).includes('ROOM_NOT_AVAILABLE')) {
        return NextResponse.json({ error: 'This time slot is no longer available' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Could not create reservation' }, { status: 500 });
    }

    // Send confirmation email (best-effort)
    try {
      await sendConfirmationEmail({
        to: data.email,
        name: data.name,
        reference,
        roomName: room.name,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        guests: data.guests,
        totalCents: total,
        manageToken,
      });
    } catch (err) {
      console.error('Email send failed', err);
    }

    return NextResponse.json({ ok: true, reservation: inserted, manageToken });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Booking failed' }, { status: 500 });
  }
}
