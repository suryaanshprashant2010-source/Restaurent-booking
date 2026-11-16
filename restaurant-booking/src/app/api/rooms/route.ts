import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('rooms').select('*').eq('is_active', true).order('capacity_max', { ascending: true });
  if (error) return NextResponse.json({ error: 'Failed to load rooms' }, { status: 500 });
  return NextResponse.json({ rooms: data });
}
