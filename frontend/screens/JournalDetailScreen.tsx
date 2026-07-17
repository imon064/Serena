import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';
import { useJournal } from '../context/JournalContext';
import { InsightCard } from '../components/InsightCard';
import { MoodChart } from '../components/MoodChart';
import { BottomNav, Tab } from '../components/BottomNav';
import { Icon } from '../components/Icon';

interface Props {
  date: string;
  onBack: () => void;
  onEdit: (date: string) => void;
  onChangeTab: (tab: Tab) => void;
  // When true, the built-in bottom nav is hidden (host screen provides one).
  hideNav?: boolean;
}

const moodEmoji = (mood: string) => {
  switch (mood?.toUpperCase()) {
    case 'SAD': return '😢';
    case 'MEH': return '😐';
    case 'OKAY': return '😊';
    case 'GOOD': return '🙂';
    case 'GREAT': return '😀';
    default: return '😊';
  }
};

const moodLabel = (mood: string) => {
  if (mood?.toUpperCase() === 'OKAY') return 'Peaceful';
  return mood ? mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase() : '';
};

export const JournalDetailScreen: React.FC<Props> = ({
  date,
  onBack,
  onEdit,
  onChangeTab,
  hideNav = false,
}) => {
  const { getEntryForDate, streakCount } = useJournal();
  const entry = getEntryForDate(date);

  const dateLabel = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (!entry) {
    return (
      <View style={styles.screen}>
        <View style={[styles.card, styles.notFound]}>
          <Text style={styles.nfTitle}>Entry Not Found</Text>
          <Text style={styles.nfBody}>
            We couldn't find a journal entry for {date}.
          </Text>
          <Pressable onPress={onBack} style={styles.nfBtn}>
            <Text style={styles.nfBtnText}>Back to Calendar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.circleBtn}>
            <Icon name="back" size={18} color={colors.slate600} />
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.brandName}>Serena</Text>
            <Text style={styles.headerSub}>JOURNAL DETAIL</Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.smallBtn}>
              <Icon name="share" size={16} color={colors.slate600} />
            </View>
            <Pressable onPress={() => onEdit(date)} style={styles.smallBtnBrand}>
              <Icon name="edit" size={15} color={colors.brand} />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {/* Title block */}
          <View>
            <Text style={styles.metaLine}>
              {dateLabel} • {entry.time}
            </Text>
            <Text style={styles.title}>{entry.title}</Text>
            <View style={styles.badges}>
              <View style={styles.moodBadge}>
                <Text style={{ fontSize: 14 }}>{moodEmoji(entry.mood)}</Text>
                <Text style={styles.moodBadgeText}>{moodLabel(entry.mood)}</Text>
              </View>
              <View style={styles.timeBadge}>
                <Icon name="clock" size={13} color={colors.slate400} />
                <Text style={styles.timeBadgeText}>{entry.readingTime}</Text>
              </View>
            </View>
            <View style={styles.streakRow}>
              <Icon name="flame" size={14} />
              <Text style={styles.streakText}>Day {streakCount} streak</Text>
            </View>
          </View>

          {/* Journal text */}
          <View style={styles.textCard}>
            <Text style={styles.content}>{entry.content}</Text>
          </View>

          <InsightCard mood={moodLabel(entry.mood)} />
          <MoodChart />

          <Pressable onPress={() => onEdit(date)} style={styles.editBtn}>
            <Icon name="edit" size={16} color={colors.slate400} />
            <Text style={styles.editBtnText}>Edit Journal</Text>
          </Pressable>
        </ScrollView>

        {!hideNav && <BottomNav activeTab="home" onChangeTab={onChangeTab} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: {
    width: '100%',
    maxWidth: 420,
    flex: 1,
    maxHeight: 820,
    backgroundColor: colors.bg,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.slate100,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: { fontSize: 16, fontWeight: '800', color: colors.dark },
  headerSub: { fontSize: 10, fontWeight: '700', color: colors.slate400, letterSpacing: 1, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  smallBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnBrand: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: 24, paddingVertical: 24, gap: 24 },
  metaLine: { fontSize: 11, fontWeight: '700', color: colors.slate400 },
  title: { fontSize: 24, fontWeight: '800', color: colors.slate800, marginTop: 6, marginBottom: 12, lineHeight: 30 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.brandTint,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  moodBadgeText: { fontSize: 12, fontWeight: '800', color: colors.brand },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.slate100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  timeBadgeText: { fontSize: 12, fontWeight: '800', color: colors.slate500 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  streakText: { fontSize: 12, fontWeight: '700', color: colors.brand },
  textCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.slate100,
  },
  content: { fontSize: 13, color: colors.slate700, lineHeight: 21, fontWeight: '500' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 8,
  },
  editBtnText: { fontSize: 16, fontWeight: '800', color: colors.slate700 },
  notFound: { padding: 32, alignItems: 'center', justifyContent: 'center', flex: 0, maxHeight: undefined, gap: 8 },
  nfTitle: { fontSize: 20, fontWeight: '800', color: colors.slate800 },
  nfBody: { fontSize: 14, color: colors.slate500, textAlign: 'center', marginBottom: 16 },
  nfBtn: { backgroundColor: colors.brand, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24 },
  nfBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});

export default JournalDetailScreen;
