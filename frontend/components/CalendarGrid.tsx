import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';

interface Props {
  // Month currently shown: `year` and 0-indexed `month` (0 = January).
  year: number;
  month: number;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  journalDates: string[];
}

const HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

type Day = { dateStr: string; displayNum: string; isCurrentMonth: boolean };

// Builds a Sunday-first calendar grid for the given month, including the
// trailing days of the previous month and the leading days of the next month
// needed to fill complete weeks.
function buildDays(year: number, month: number): Day[] {
  const firstDow = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const days: Day[] = [];

  // Leading days from the previous month.
  for (let i = firstDow - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    days.push({ dateStr: fmt(prevYear, prevMonth, d), displayNum: String(d), isCurrentMonth: false });
  }
  // The month itself.
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ dateStr: fmt(year, month, d), displayNum: String(d), isCurrentMonth: true });
  }
  // Trailing days from the next month to complete the final week.
  let next = 1;
  while (days.length % 7 !== 0) {
    days.push({ dateStr: fmt(nextYear, nextMonth, next), displayNum: String(next), isCurrentMonth: false });
    next++;
  }
  return days;
}

export const CalendarGrid: React.FC<Props> = ({
  year,
  month,
  selectedDate,
  onSelectDate,
  journalDates,
}) => {
  const now = new Date();
  const todayStr = fmt(now.getFullYear(), now.getMonth(), now.getDate());

  return (
  <View style={styles.wrap}>
    <View style={styles.row}>
      {HEADERS.map((h, i) => (
        <View key={i} style={styles.cell}>
          <Text style={styles.header}>{h}</Text>
        </View>
      ))}
    </View>

    <View style={styles.grid}>
      {buildDays(year, month).map((day, idx) => {
        const isSelected = selectedDate === day.dateStr;
        const isToday = day.dateStr === todayStr;
        const hasJournal = journalDates.includes(day.dateStr);
        return (
          <View key={idx} style={styles.cell}>
            <Pressable
              onPress={() => day.isCurrentMonth && onSelectDate(day.dateStr)}
              disabled={!day.isCurrentMonth}
              style={[
                styles.day,
                isToday && !isSelected && styles.dayToday,
                isSelected && styles.daySelected,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  !day.isCurrentMonth && styles.dayMuted,
                  isToday && !isSelected && styles.dayTextToday,
                  isSelected && styles.dayTextSelected,
                ]}
              >
                {day.displayNum}
              </Text>
            </Pressable>
            {hasJournal && <View style={styles.dot} />}
          </View>
        );
      })}
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: 14 },
  row: { flexDirection: 'row' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14 },
  cell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 40,
  },
  header: { fontSize: 12, fontWeight: '700', color: colors.slate400 },
  day: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: { backgroundColor: colors.brand },
  // Today gets an outlined ring so it stands out without competing with the
  // filled "selected" day.
  dayToday: { borderWidth: 1.5, borderColor: colors.brand, backgroundColor: colors.brandFaint },
  dayText: { fontSize: 12, fontWeight: '700', color: colors.slate800 },
  dayMuted: { color: '#E2E8F0' },
  dayTextSelected: { color: colors.white },
  dayTextToday: { color: colors.brand, fontWeight: '800' },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.brand,
    marginTop: 2,
  },
});

export default CalendarGrid;
