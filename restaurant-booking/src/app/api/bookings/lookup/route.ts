import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { lookupSchema } from '@/lib/booking/validation';
import { hashToken } from '@/lib/booking/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = lookupSchema.safeParse({ reference: body.reference, email: body.email });
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    const token = String(body.token || '');
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('reservations')
      .select('*, rooms(name,slug)')
      .eq('reference', parsed.data.reference.trim())
      .eq('customer_email', parsed.data.email.toLowerCase())
      .single();
    if (error || !data) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    if (token && hashToken(token) !== data.manage_token_hash) {
      return NextResponse.json({ error: 'Invalid or missing secure token' }, { status: 403 });
    }
    // If no token provided, still allow limited view but encourage secure link? spec says "retrieve their reservations securely"
    // Require token for full management actions; for view we allow if token matches or if they came from confirmation context is safer.
    if (!token) return NextResponse.json({ error: 'Secure access token required. Use the link from your confirmation email.' }, { status: 403 });
    const { manage_token_hash, ...safe } = data as any;
    return NextResponse.json({ reservation: safe });
  } catch (e: any) {
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }
}