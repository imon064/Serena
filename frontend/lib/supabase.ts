import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Set EXPO_PUBLIC_SUPABASE_URL and ' +
      'EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // On React Native the session is stored in AsyncStorage, not localStorage.
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // There is no URL bar on a phone, so Supabase must NOT try to read the
    // session from a URL automatically. We handle the OAuth redirect manually.
    detectSessionInUrl: false,
    // PKCE is the secure flow for mobile OAuth.
    flowType: 'pkce',
  },
});
