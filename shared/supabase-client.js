/**
 * Shared Supabase client.
 *
 * All pages import the same singleton instead of re-initializing and
 * re-declaring the URL/key constants in every file. The "publishable"
 * anon key is safe to expose in client code (RLS policies enforce access),
 * but the service_role key must NEVER appear here.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://nylbgdizzlpsaacrbsae.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_pmUom2TfYAl2oa3OrFXpSw_JVL4LE4P';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/**
 * Return the current session (or null).
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Auth guard: require a signed-in session, otherwise redirect to /auth.html
 * and halt the caller by returning a promise that never resolves (so the
 * rest of the page's init code never runs against a null session).
 */
export async function requireSession(redirectTo = '/auth.html') {
  const session = await getSession();
  if (!session) {
    window.location.href = redirectTo;
    // Never resolve so top-level `await requireSession()` halts cleanly.
    return new Promise(() => {});
  }
  return session;
}
