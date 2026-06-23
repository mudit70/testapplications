import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL ?? 'https://x.supabase.co',
  process.env.SUPABASE_KEY ?? 'anon-key',
);

export async function reindex(payload: object) {
  return supabase.functions.invoke('reindex', { body: payload });
}
