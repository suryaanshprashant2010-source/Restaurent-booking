import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { hashToken } from '@/lib/booking/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reference, email, token, action, note } = body || {};
    if (!reference || !email || !token || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const supabase = getSupabaseAdmin();
    const { data: resv, error } = await supabase.from('reservations').select('*').eq('reference', reference).eq('customer_email', String(email).toLowerCase()).single();
    if (error || !resv) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    if (hashToken(String(token)) !== resv.manage_token_hash) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    if (action === 'cancel') {
      const { error: upErr } = await supabase.from('reservations').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', resv.id);
      if (upErr) return NextResponse.json({ error: 'Could not cancel reservation' }, { status: 500 });
      return NextResponse.json({ ok: true, status: 'cancelled' });
    }
    if (action === 'request_modification') {
      const reqText = String(note || '').slice(0, 1000);
      const merged = [resv.special_requests, `[Modification requested]: ${reqText}`].filter(Boolean).join('\n');
      const { error: upErr } = await supabase.from('reservations').update({ status: 'modification_requested', special_requests: merged, updated_at: new Date().toISOString() }).eq('id', resv.id);
      if (upErr) return NextResponse.json({ error: 'Could not submit modification request' }, { status: 500 });
      return NextResponse.json({ ok: true, status: 'modification_requested' });
    }
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}