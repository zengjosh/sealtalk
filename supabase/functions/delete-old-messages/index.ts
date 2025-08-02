// @deno-types="https://esm.sh/@supabase/supabase-js@2/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Original 24-hour cutoff

  const { error } = await supabase
    .from('messages')
    .delete()
    .lt('created_at', cutoff);

  if (error) {
    console.error('Error deleting old messages:', error);
    return new Response('Error', { status: 500 });
  }

  return new Response('Old messages deleted', { status: 200 });
});
