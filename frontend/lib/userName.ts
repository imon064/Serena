import type { User } from '@supabase/supabase-js';

/**
 * Derives a human-readable name from a Supabase user.
 *
 * We set `full_name` in user_metadata at email/password signup, and Google
 * OAuth populates `full_name`/`name`. We fall back through the common metadata
 * keys, then to the email local-part, and finally a neutral default so the UI
 * never shows an empty greeting.
 */
export function getFullName(user: User | null | undefined): string {
  if (!user) return 'there';

  const meta = user.user_metadata ?? {};
  const candidate =
    meta.full_name ||
    meta.name ||
    meta.given_name ||
    (user.email ? user.email.split('@')[0] : '');

  const trimmed = String(candidate ?? '').trim();
  return trimmed || 'there';
}

/** First name only — used for casual greetings like "Hello Darren!". */
export function getFirstName(user: User | null | undefined): string {
  return getFullName(user).split(/\s+/)[0];
}
