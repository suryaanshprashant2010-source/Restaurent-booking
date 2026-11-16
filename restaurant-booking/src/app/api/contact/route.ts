import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { contactSchema } from '@/lib/booking/validation';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const rl = rateLimit(`contact:${getClientIp(req)}`, 10, 60_000);
    if (!rl.ok) return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Please provide valid contact details and a message (min 10 characters).' }, { status: 400 });
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('contact_messages').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    if (error) return NextResponse.json({ error: 'Could not send message at this time.' }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}