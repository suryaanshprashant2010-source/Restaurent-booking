import { getSupabaseAdmin } from '@/lib/supabase/server';
import type { Room } from '@/types';

export async function getRooms(): Promise<Room[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('rooms').select('*').eq('is_active', true).order('capacity_max', { ascending: true });
    if (error || !data) return [];
    return data as Room[];
  } catch {
    return [];
  }
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('rooms').select('*').eq('slug', slug).eq('is_active', true).single();
    if (error || !data) return null;
    return data as Room;
  } catch {
    return null;
  }
}