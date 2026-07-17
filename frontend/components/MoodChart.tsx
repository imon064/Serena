import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';

const TRACK_H = 90;

const DATA: { day: string; pct: number; active?: boolean; label?: string }[] = [
  { day: 'M', pct: 35 },
  { day: 'T', pct: 50 },
  { day: 'W', pct: 40 },
  { day: 'T', pct: 90, active: true, label: 'Today' },
  { day: 'F', pct: 55 },
  { day: 'S', pct: 30 },
  { day: 'S', pct: 45 },
];

export const MoodChart: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.title}>Your Mood This Week</Text>
        <Text style={styles.subtitle}>Trending: Positively upward</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.pct}>84%</Text>
        <Text style={styles.pctLabel}>OVERALL CLARITY</Text>
      </View>
    </View>

    <View style={styles.chart}>
      {DATA.map((item, i) => (
        <View key={i} style={styles.col}>
          {item.active && <Text style={styles.todayLabel}>{item.label}</Text>}
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { height: (TRACK_H * item.pct) / 100 },
                item.active ? styles.fillActive : styles.fillIdle,
              ]}
            />
          </View>
          <Text style={[styles.dayText, item.active && styles.dayActive]}>
            {item.day}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.slate100,
    gap: 20,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 14, fontWeight: '700', color: colors.slate800 },
  subtitle: { fontSize: 11, fontWeight: '600', color: colors.slate400, marginTop: 2 },
  pct: { fontSize: 20, fontWeight: '800', color: colors.brand },
  pctLabel: { fontSize: 9, fontWeight: '700', color: colors.slate400, letterSpacing: 0.5, marginTop: 2 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 8 },
  col: { flex: 1, alignItems: 'center', gap: 8 },
  todayLabel: { fontSize: 10, fontWeight: '800', color: colors.brand, position: 'absolute', top: -14 },
  track: {
    width: 24,
    height: TRACK_H,
    backgroundColor: colors.slate100,
    borderRadius: 999,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: { width: '100%', borderRadius: 999 },
  fillActive: { backgroundColor: colors.brand },
  fillIdle: { backgroundColor: '#D9CCFB' },
  dayText: { fontSize: 12, fontWeight: '700', color: colors.slate400 },
  dayActive: { color: colors.brand, fontWeight: '800' },
});

export default MoodChart;
