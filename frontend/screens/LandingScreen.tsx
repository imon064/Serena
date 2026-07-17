import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors, fonts } from '../lib/theme';

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const LandingScreen: React.FC<Props> = ({ onGetStarted, onSignIn }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 640;
  const h1Size = isDesktop ? 62 : isTablet ? 48 : 35;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------- Nav ---------- */}
      <View style={[styles.nav, styles.section, isDesktop && styles.navDesktop]}>
        <View style={styles.brandRow}>
          <View style={styles.logoDot}>
            <Text style={styles.logoDotText}>S</Text>
          </View>
          <Text style={styles.brandName}>Serena</Text>
        </View>

        {isDesktop && (
          <View style={styles.navLinks}>
            <Text style={styles.navLink}>Home</Text>
            <Text style={styles.navLink}>Features</Text>
            <Text style={styles.navLink}>About</Text>
          </View>
        )}

        <View style={styles.navActions}>
          <Pressable onPress={onSignIn} hitSlop={8}>
            <Text style={styles.navSignIn}>Sign In</Text>
          </Pressable>
          <Pressable
            onPress={onGetStarted}
            style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
          >
            <Text style={styles.pillText}>Get started</Text>
          </Pressable>
        </View>
      </View>

      {/* ---------- Hero ---------- */}
      <View style={[styles.section, styles.hero]}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Your mental wellness companion</Text>
        </View>

        <View style={styles.h1Row}>
          {['A', 'safe', 'place', 'to'].map((w) => (
            <Text key={w} style={[styles.h1Word, { fontSize: h1Size }]}>
              {w}
            </Text>
          ))}
          <Text style={[styles.h1Word, styles.h1Purple, { fontSize: h1Size }]}>
            reflect
          </Text>
          <Text style={[styles.h1Word, { fontSize: h1Size }]}>and</Text>
          <Circled color={colors.yellow}>
            <Text style={[styles.h1Word, styles.h1Circled, { fontSize: h1Size }]}>
              feel better
            </Text>
          </Circled>
        </View>

        <Text style={[styles.heroSub, { maxWidth: isDesktop ? 600 : 440 }]}>
          Serena is a caring companion that remembers your journal, understands
          your moods, and is always here to listen — whenever you need it.
        </Text>

        <View style={[styles.heroCtas, !isTablet && styles.heroCtasStack]}>
          <Pressable
            onPress={onGetStarted}
            style={({ pressed }) => [
              styles.ctaPrimary,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.ctaPrimaryText}>Get started  →</Text>
          </Pressable>
          <Pressable
            onPress={onSignIn}
            style={({ pressed }) => [
              styles.ctaGhost,
              pressed && styles.ctaGhostPressed,
            ]}
          >
            <Text style={styles.ctaGhostText}>I already have an account</Text>
          </Pressable>
        </View>

        <View style={styles.tagRow}>
          <View style={[styles.tag, { backgroundColor: colors.lavender }]}>
            <Text style={styles.tagText}>#calm</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.yellow }]}>
            <Text style={styles.tagText}>#reflect</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.brand }]}>
            <Text style={[styles.tagText, { color: colors.white }]}>#grow</Text>
          </View>
        </View>
      </View>

      {/* ---------- Mission band ---------- */}
      <View style={styles.missionOuter}>
        <View style={[styles.section, styles.missionInner]}>
          <View style={styles.missionSeal}>
            <Text style={styles.missionSealText}>✷</Text>
          </View>
          <Text style={[styles.missionText, { fontSize: isDesktop ? 30 : 24 }]}>
            We're here to help you{' '}
            <Text style={styles.missionAccent}>understand your feelings</Text>{' '}
            and grow into your calmest, most resilient self.
          </Text>
        </View>
      </View>

      {/* ---------- Features ---------- */}
      <View style={[styles.section, styles.featuresWrap]}>
        <Text style={[styles.h2, { fontSize: isDesktop ? 40 : 30 }]}>
          Our <Text style={styles.h2Accent}>caring</Text> features
        </Text>

        <View
          style={[
            styles.cardGrid,
            { flexDirection: isTablet ? 'row' : 'column' },
          ]}
        >
          <FeatureCard
            bg={colors.lavender}
            fg={colors.dark}
            symbol="✦"
            symbolColor={colors.brand}
            symbolBg={colors.white}
            title="Journal that listens"
            body="Write freely about your day. Serena reflects back what matters — no judgement, ever."
          />
          <FeatureCard
            bg={colors.brand}
            fg={colors.white}
            symbol="✷"
            symbolColor={colors.yellow}
            symbolBg={colors.purpleDeep}
            title="A friend who remembers"
            body="Chat with a companion that knows your story and talks like a friend, not a bot."
          />
          <FeatureCard
            bg={colors.yellow}
            fg={colors.dark}
            symbol="✸"
            symbolColor={colors.brand}
            symbolBg={colors.white}
            title="See your mood journey"
            body="Track how you feel over time and gently notice the patterns behind your days."
          />
        </View>
      </View>

      {/* ---------- How it works ---------- */}
      <View style={[styles.section, styles.stepsWrap]}>
        <Text style={[styles.h2, { fontSize: isDesktop ? 40 : 30 }]}>
          How <Text style={styles.h2Accent}>Serena</Text> works
        </Text>
        <View
          style={[styles.steps, { flexDirection: isTablet ? 'row' : 'column' }]}
        >
          <Step n="1" title="Write or talk" body="Share what's on your mind — a journal entry or a quick chat." />
          <Step n="2" title="Serena understands" body="She reads your mood and remembers what's going on in your life." />
          <Step n="3" title="Feel a little lighter" body="Get gentle reflection, support, and a clearer view of your week." />
        </View>
      </View>

      {/* ---------- Safety note ---------- */}
      <View style={styles.section}>
        <View style={styles.safetyCard}>
          <View style={styles.safetySymbol}>
            <Text style={styles.safetySymbolText}>✷</Text>
          </View>
          <View style={styles.safetyTextWrap}>
            <Text style={styles.safetyTitle}>You're not alone</Text>
            <Text style={styles.safetyBody}>
              Serena is a supportive companion, not a replacement for
              professional care. If you're in crisis or need urgent help, please
              reach out — Kemenkes SEJIWA:{' '}
              <Text style={styles.safetyStrong}>119 ext. 8</Text> (Indonesia), or
              emergency <Text style={styles.safetyStrong}>112</Text>.
            </Text>
          </View>
        </View>
      </View>

      {/* ---------- Final CTA ---------- */}
      <View style={[styles.section, styles.finalCta]}>
        <Text style={[styles.finalTitle, { fontSize: isDesktop ? 40 : 28 }]}>
          Ready to feel a little{' '}
          <Text style={styles.h1Purple}>lighter</Text>?
        </Text>
        <Pressable
          onPress={onGetStarted}
          style={({ pressed }) => [styles.ctaPrimary, pressed && styles.pressed]}
        >
          <Text style={styles.ctaPrimaryText}>Get started for free  →</Text>
        </Pressable>
      </View>

      {/* ---------- Footer ---------- */}
      <View style={styles.footer}>
        <View style={styles.brandRow}>
          <View style={[styles.logoDot, { width: 26, height: 26 }]}>
            <Text style={[styles.logoDotText, { fontSize: 15 }]}>S</Text>
          </View>
          <Text style={[styles.brandName, { fontSize: 18 }]}>Serena</Text>
        </View>
        <Text style={styles.footerNote}>
          © 2026 Serena · Made with care for your mind.
        </Text>
      </View>
    </ScrollView>
  );
};

/* ---------- A word wrapped in a hand-drawn-style circle outline ---------- */

const Circled: React.FC<{ children: React.ReactNode; color: string }> = ({
  children,
  color,
}) => (
  <View style={styles.circledWrap}>
    <View
      pointerEvents="none"
      style={[styles.circleOutline, { borderColor: color }]}
    />
    <View style={styles.circledInner}>{children}</View>
  </View>
);

/* ---------- Feature card ---------- */

const FeatureCard: React.FC<{
  bg: string;
  fg: string;
  symbol: string;
  symbolColor: string;
  symbolBg: string;
  title: string;
  body: string;
}> = ({ bg, fg, symbol, symbolColor, symbolBg, title, body }) => (
  <View style={[styles.card, { backgroundColor: bg }]}>
    <View style={[styles.cardSymbol, { backgroundColor: symbolBg }]}>
      <Text style={[styles.cardSymbolText, { color: symbolColor }]}>
        {symbol}
      </Text>
    </View>
    <Text style={[styles.cardTitle, { color: fg }]}>{title}</Text>
    <Text style={[styles.cardBody, { color: fg }]}>{body}</Text>
  </View>
);

/* ---------- Step ---------- */

const Step: React.FC<{ n: string; title: string; body: string }> = ({
  n,
  title,
  body,
}) => (
  <View style={styles.step}>
    <View style={styles.stepNum}>
      <Text style={styles.stepNumText}>{n}</Text>
    </View>
    <Text style={styles.stepTitle}>{title}</Text>
    <Text style={styles.stepBody}>{body}</Text>
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 40 },
  section: { width: '100%', maxWidth: 1120, alignSelf: 'center', paddingHorizontal: 24 },

  /* nav */
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    flexWrap: 'wrap',
    gap: 12,
  },
  navDesktop: { paddingVertical: 24 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoDot: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoDotText: { color: colors.white, ...fonts.display, fontSize: 19 },
  brandName: { fontSize: 23, ...fonts.display, color: colors.dark },
  navLinks: { flexDirection: 'row', gap: 28 },
  navLink: { fontSize: 15, ...fonts.bodySemi, color: colors.slate500 },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  navSignIn: { fontSize: 15, ...fonts.bodyBold, color: colors.dark },
  pill: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  pillText: { color: colors.white, ...fonts.displaySemi, fontSize: 15 },
  pressed: { backgroundColor: colors.brandHover },

  /* hero */
  hero: { alignItems: 'center', paddingTop: 44, paddingBottom: 24 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.lavenderLight,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.lavender,
  },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand },
  badgeText: { color: colors.brand, ...fonts.bodyBold, fontSize: 13 },

  h1Row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    maxWidth: 900,
  },
  h1Word: {
    ...fonts.display,
    color: colors.dark,
    marginHorizontal: 8,
    marginVertical: 6,
    lineHeight: undefined,
  },
  h1Purple: { color: colors.brand },
  h1Circled: { color: colors.dark, marginHorizontal: 0 },
  circledWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    marginVertical: 6,
    transform: [{ rotate: '-2deg' }],
  },
  circleOutline: {
    position: 'absolute',
    top: -6,
    bottom: -6,
    left: -12,
    right: -12,
    borderWidth: 3.5,
    borderRadius: 999,
  },
  circledInner: { paddingHorizontal: 6 },

  heroSub: {
    fontSize: 17,
    ...fonts.body,
    color: colors.slate500,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 27,
  },
  heroCtas: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 30 },
  heroCtasStack: { flexDirection: 'column', alignSelf: 'stretch' },
  ctaPrimary: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 15,
    alignItems: 'center',
  },
  ctaPrimaryText: { color: colors.white, ...fonts.displaySemi, fontSize: 16 },
  ctaGhost: {
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  ctaGhostPressed: { backgroundColor: colors.slate100 },
  ctaGhostText: { color: colors.dark, ...fonts.bodyBold, fontSize: 15 },
  tagRow: { flexDirection: 'row', gap: 12, marginTop: 34, flexWrap: 'wrap', justifyContent: 'center' },
  tag: { borderRadius: 999, paddingHorizontal: 18, paddingVertical: 9 },
  tagText: { ...fonts.bodyBold, fontSize: 14, color: colors.dark },

  /* mission */
  missionOuter: { backgroundColor: colors.brand, marginTop: 44, paddingVertical: 60 },
  missionInner: { alignItems: 'center' },
  missionSeal: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  missionSealText: { fontSize: 26, color: colors.dark },
  missionText: {
    color: colors.white,
    ...fonts.displaySemi,
    textAlign: 'center',
    lineHeight: 42,
    maxWidth: 780,
  },
  missionAccent: { color: colors.yellow },

  /* features */
  featuresWrap: { marginTop: 64, alignItems: 'center' },
  h2: { ...fonts.display, color: colors.dark, textAlign: 'center' },
  h2Accent: { color: colors.brand },
  cardGrid: {
    marginTop: 38,
    gap: 20,
    alignSelf: 'stretch',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    minWidth: 260,
    borderRadius: 28,
    padding: 28,
    gap: 14,
  },
  cardSymbol: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSymbolText: { fontSize: 28, lineHeight: 34 },
  cardTitle: { fontSize: 22, ...fonts.displaySemi, marginTop: 4 },
  cardBody: { fontSize: 15, ...fonts.body, lineHeight: 23 },

  /* steps */
  stepsWrap: { marginTop: 72, alignItems: 'center' },
  steps: { marginTop: 38, gap: 20, alignSelf: 'stretch', justifyContent: 'center' },
  step: {
    flex: 1,
    minWidth: 240,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 26,
    borderWidth: 1,
    borderColor: colors.slate100,
    gap: 10,
  },
  stepNum: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: colors.brand, ...fonts.display, fontSize: 19 },
  stepTitle: { fontSize: 19, ...fonts.displaySemi, color: colors.dark },
  stepBody: { fontSize: 14, ...fonts.body, color: colors.slate500, lineHeight: 22 },

  /* safety */
  safetyCard: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colors.lavenderLight,
    borderRadius: 24,
    padding: 26,
    marginTop: 72,
    borderWidth: 1,
    borderColor: colors.lavender,
    alignItems: 'center',
  },
  safetySymbol: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetySymbolText: { color: colors.yellow, fontSize: 24, lineHeight: 28 },
  safetyTextWrap: { flex: 1, gap: 6 },
  safetyTitle: { fontSize: 19, ...fonts.displaySemi, color: colors.dark },
  safetyBody: { fontSize: 14, ...fonts.body, color: colors.slate500, lineHeight: 23 },
  safetyStrong: { color: colors.brand, ...fonts.bodyExtra },

  /* final cta */
  finalCta: { alignItems: 'center', marginTop: 80, gap: 26 },
  finalTitle: { ...fonts.display, color: colors.dark, textAlign: 'center' },

  /* footer */
  footer: {
    marginTop: 72,
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
    alignItems: 'center',
    gap: 10,
  },
  footerNote: { fontSize: 13, ...fonts.body, color: colors.slate400 },
});
