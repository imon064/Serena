import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';
import { useJournal } from '../context/JournalContext';
import { CalendarGrid } from '../components/CalendarGrid';
import { BottomNav, Tab } from '../components/BottomNav';
import { Icon } from '../components/Icon';

interface Props {
  onBack: () => void;
  onCreateEntry: (date: string) => void;
  onOpenEntry: (date: string) => void;
  onChangeTab: (tab: Tab) => void;
  // When true, the built-in bottom nav is hidden (host screen provides one).
  hideNav?: boolean;
}

export const JournalCalendarScreen: React.FC<Props> = ({
  onBack,
  onCreateEntry,
  onOpenEntry,
  onChangeTab,
  hideNav = false,
}) => {
  const { selectedDate, setSelectedDate, entries, streakCount } = useJournal();
  const journalDates = Object.keys(entries);
  const hasJournal = !!entries[selectedDate];

  // The month currently displayed by the calendar. Starts on the selected
  // date's month, and the chevrons move it backward/forward.
  const [selYear, selMonth] = selectedDate.split('-').map(Number);
  const [view, setView] = useState({ year: selYear, month: selMonth - 1 });

  const goToMonth = (delta: number) =>
    setView((v) => {
      const total = v.year * 12 + v.month + delta;
      return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
    });

  const viewFirst = new Date(view.year, view.month, 1);
  const monthLabel = viewFirst.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const monthName = viewFirst.toLocaleDateString('en-US', { month: 'long' });
  const monthPrefix = `${view.year}-${String(view.month + 1).padStart(2, '0')}`;
  const monthCount = journalDates.filter((d) => d.startsWith(monthPrefix)).length;

  const handleAction = () => {
    if (hasJournal) onOpenEntry(selectedDate);
    else onCreateEntry(selectedDate);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.circleBtn}>
            <Icon name="back" size={18} color={colors.slate600} />
          </Pressable>
          <Text style={styles.headerTitle}>Select Date</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {/* Calendar card */}
          <View style={styles.calCard}>
            <View style={styles.calHeader}>
              <View>
                <Text style={styles.month}>{monthLabel}</Text>
                <View style={styles.streakRow}>
                  <Icon name="flame" size={12} />
                  <Text style={styles.streakText}>Day {streakCount} streak</Text>
                </View>
              </View>
              <View style={styles.chevrons}>
                <Pressable onPress={() => goToMonth(-1)} style={styles.chevBtn}>
                  <Icon name="chevronLeft" size={18} color={colors.slate600} />
                </Pressable>
                <Pressable onPress={() => goToMonth(1)} style={styles.chevBtn}>
                  <Icon name="chevronRight" size={18} color={colors.slate600} />
                </Pressable>
              </View>
            </View>

            <CalendarGrid
              year={view.year}
              month={view.month}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              journalDates={journalDates}
            />
          </View>

          {/* Action button */}
          <Pressable
            onPress={handleAction}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          >
            <Text style={styles.actionText}>
              {hasJournal ? 'Read Previous Journal' : '+ Create New Entry'}
            </Text>
          </Pressable>

          {/* Reflection card */}
          <View style={styles.reflectCard}>
            <View style={styles.bookTile}>
              <Icon name="book" size={18} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reflectTitle}>Your {monthName} Reflection</Text>
              <Text style={styles.reflectSub}>
                {monthCount} journals completed this month
              </Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <Text style={styles.stat}>Total Entries: {journalDates.length}</Text>
            <Text style={styles.stat}>•</Text>
            <Text style={styles.stat}>Streak: {streakCount} Days</Text>
            <Text style={styles.stat}>•</Text>
            <Text style={styles.stat}>Mood: 😊 Calm</Text>
          </View>
        </ScrollView>

        {!hideNav && <BottomNav activeTab="journal" onChangeTab={onChangeTab} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lavenderLight },
  card: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.lavenderLight,
    overflow: 'hidden',
  },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.brand },
  body: { paddingHorizontal: 24, paddingBottom: 24, gap: 20 },
  calCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.slate100,
    gap: 24,
  },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  month: { fontSize: 20, fontWeight: '800', color: colors.slate800 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  streakText: { fontSize: 12, fontWeight: '700', color: colors.brand },
  chevrons: { flexDirection: 'row', gap: 8 },
  chevBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    backgroundColor: colors.brand,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionText: { color: colors.white, fontWeight: '800', fontSize: 16 },
  pressed: { backgroundColor: colors.brandHover },
  reflectCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.slate100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bookTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reflectTitle: { fontSize: 12, fontWeight: '800', color: colors.slate800 },
  reflectSub: { fontSize: 11, fontWeight: '600', color: colors.slate400, marginTop: 3 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, flexWrap: 'wrap' },
  stat: { fontSize: 10, fontWeight: '700', color: colors.slate400, letterSpacing: 0.3 },
});

export default JournalCalendarScreen;
