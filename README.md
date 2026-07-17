# Serena

Serena is a small mental-wellbeing app. It gives you a gentle AI companion to talk
to, a daily mood journal, a calendar to look back on how you've felt, and a short
monthly reflection written from your entries.

It's built with Expo / React Native (runs in the browser, iOS, and Android) and
uses Supabase for auth and the AI backend.

## Running it

Easiest way is on your phone with the Expo Go app. You'll need Node 18 or newer,
and Expo Go (v54.0.8) installed from the App Store or Google Play.

1. Clone and go into the app folder:

   ```
   git clone https://github.com/imon064/Serena.git
   cd Serena/frontend
   ```

2. Create the env file and add the two Supabase keys (we've included these with
   the submission):

   ```
   cp .env.example .env
   ```

   Then open `frontend/.env` and fill in:

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://swiikngjuxdkbwsnbgut.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aWlrbmdqdXhka2J3c25iZ3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxODI5MDUsImV4cCI6MjA5OTc1ODkwNX0.VrtChTkbMLsb-eh4EoseEyFxsTdj-u_m3nRh6aIFZ2w
   ```

3. Install and start:

   ```
   npm install
   npx expo start --tunnel
   ```

A barcode appears in the terminal. Scan it with your phone (camera on iOS, or the
Expo Go app on Android) to open Serena.

Prefer the browser? Click the localhost link shown below the barcode instead.

## Layout

- `frontend/` — the app you run (screens, components, state, Supabase helpers)
- `supabase/functions/` — the AI backend, already deployed. `chat` powers the
  conversation, `summarize` writes the monthly reflection.

The backend already runs on Supabase, so there's nothing else to set up beyond
the two keys above.

## If something breaks

- "Missing Supabase env vars" — make sure `frontend/.env` exists with both keys,
  then restart with `npx expo start --tunnel`.
- Barcode won't connect — make sure your phone and computer are online, and that
  Expo Go is v54.0.8.
- Blank or stuck page (browser) — hard refresh with Ctrl/Cmd + Shift + R.
- Install errors — check you're on Node 18+ (`node --version`).

Serena is a supportive companion, not a replacement for professional help.
