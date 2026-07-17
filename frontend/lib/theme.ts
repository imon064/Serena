export const colors = {
  brand: '#6D3EF5',
  brandHover: '#5A2EE3',
  brandLight: '#F5F3FF',
  dark: '#110B30',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate100: '#F1F5F9',
  border: '#E2E8F0',
  white: '#FFFFFF',
  red: '#DC2626',
  redBg: '#FEF2F2',
  bg: '#FAF9FF',
  // Playful accents used by the landing page.
  yellow: '#FFD34E',
  yellowSoft: '#FFE9A6',
  lavender: '#E8E5F9',
  lavenderLight: '#F4F2FD',
  purpleSoft: '#B9A6F5',
  purpleDeep: '#4A2AB0',
  // Extra slate shades + accents used by the journal screens.
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate50: '#F8FAFC',
  green: '#22C55E',
  brandTint: '#EDE9FE', // ~brand at 10% on white, for soft badges/pills
};

// Font style fragments (family + weight), spread into text styles with `...`.
// Fonts are loaded on web from Google Fonts (see App.tsx). On native they fall
// back to the system font at the given weight.
// Fredoka = rounded, friendly display face; Nunito = clean, warm body face.
export const fonts = {
  display: { fontFamily: 'Fredoka', fontWeight: '700' as const },
  displaySemi: { fontFamily: 'Fredoka', fontWeight: '600' as const },
  displayMedium: { fontFamily: 'Fredoka', fontWeight: '500' as const },
  body: { fontFamily: 'Nunito', fontWeight: '500' as const },
  bodySemi: { fontFamily: 'Nunito', fontWeight: '600' as const },
  bodyBold: { fontFamily: 'Nunito', fontWeight: '700' as const },
  bodyExtra: { fontFamily: 'Nunito', fontWeight: '800' as const },
};
