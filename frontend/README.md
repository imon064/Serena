# Serena Mobile (Expo)

A React Native mobile app with Supabase auth: email/password login & register,
plus Google sign-in. Runs in **Expo Go** on your phone.

## Run it

```bash
cd SerenaMobile
npm install
npx expo start
```

Then scan the QR code with the **Expo Go** app (Android) or the Camera app (iOS).

## Supabase setup (required for Google login)

Your credentials are already in `.env`. For Google sign-in to work on mobile,
in the Supabase dashboard → Authentication → URL Configuration → **Redirect URLs**,
add the redirect URI the app prints (see the login screen error text if it
fails, or log `redirectUri` from `useAuth()`). In Expo Go this looks like
`exp://…`. For a production build it will be `serena://`.

Google provider must be enabled under Authentication → Providers → Google
(same as the web setup).

## Notes

- Email/password login works immediately in Expo Go.
- Google login in Expo Go uses an in-app browser (expo-web-browser). For the
  most reliable Google experience you may later switch to an Expo Dev Build.
- `App.tsx` shows a placeholder Home screen after login — build your journal
  screens from there.

## Structure

- `lib/supabase.ts` – Supabase client (AsyncStorage session storage)
- `context/AuthContext.tsx` – session state + auth methods incl. Google OAuth
- `screens/` – Login, Register, Home
- `components/` – Button, Input, Google button
