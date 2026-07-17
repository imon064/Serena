import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';

interface Props {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  journalDates: string[];
}

const HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const DAYS: { dateStr: string; displayNum: string; isCurrentMonth: boolean }[] =
  [
    { dateStr: '2023-09-24', displayNum: '24', isCurrentMonth: false },
    { dateStr: '2023-09-25', displayNum: '25', isCurrentMonth: false },
    { dateStr: '2023-09-26', displayNum: '26', isCurrentMonth: false },
    { dateStr: '2023-09-27', displayNum: '27', isCurrentMonth: false },
    { dateStr: '2023-09-28', displayNum: '28', isCurrentMonth: false },
    { dateStr: '2023-09-29', displayNum: '29', isCurrentMonth: false },
    { dateStr: '2023-10-01', displayNum: '1', isCurrentMonth: true },
    { dateStr: '2023-10-02', displayNum: '2', isCurrentMonth: true },
    { dateStr: '2023-10-03', displayNum: '3', isCurrentMonth: true },
    { dateStr: '2023-10-04', displayNum: '4', isCurrentMonth: true },
    { dateStr: '2023-10-05', displayNum: '5', isCurrentMonth: true },
    { dateStr: '2023-10-06', displayNum: '6', isCurrentMonth: true },
    { dateStr: '2023-10-07', displayNum: '7', isCurrentMonth: true },
    { dateStr: '2023-10-08', displayNum: '8', isCurrentMonth: true },
    { dateStr: '2023-10-09', displayNum: '9', isCurrentMonth: true },
    { dateStr: '2023-10-10', displayNum: '10', isCurrentMonth: true },
    { dateStr: '2023-10-11', displayNum: '11', isCurrentMonth: true },
    { dateStr: '2023-10-12', displayNum: '12', isCurrentMonth: true },
    { dateStr: '2023-10-13', displayNum: '13', isCurrentMonth: true },
    { dateStr: '2023-10-14', displayNum: '14', isCurrentMonth: true },
    { dateStr: '2023-10-15', displayNum: '15', isCurrentMonth: true },
    { dateStr: '2023-10-16', displayNum: '16', isCurrentMonth: true },
    { dateStr: '2023-10-17', displayNum: '17', isCurrentMonth: true },
    { dateStr: '2023-10-18', displayNum: '18', isCurrentMonth: true },
    { dateStr: '2023-10-19', displayNum: '19', isCurrentMonth: true },
    { dateStr: '2023-10-20', displayNum: '20', isCurrentMonth: true },
    { dateStr: '2023-10-21', displayNum: '21', isCurrentMonth: true },
    { dateStr: '2023-10-22', displayNum: '22', isCurrentMonth: true },
    { dateStr: '2023-10-23', displayNum: '23', isCurrentMonth: true },
    { dateStr: '2023-10-24', displayNum: '24', isCurrentMonth: true },
    { dateStr: '2023-10-25', displayNum: '25', isCurrentMonth: true },
    { dateStr: '2023-10-26', displayNum: '26', isCurrentMonth: true },
    { dateStr: '2023-10-27', displayNum: '27', isCurrentMonth: true },
    { dateStr: '2023-10-28', displayNum: '28', isCurrentMonth: true },
    { dateStr: '2023-10-29', displayNum: '29', isCurrentMonth: true },
    { dateStr: '2023-10-30', displayNum: '30', isCurrentMonth: true },
    { dateStr: '2023-10-31', displayNum: '31', isCurrentMonth: true },
    { dateStr: '2023-11-01', displayNum: '1', isCurrentMonth: false },
    { dateStr: '2023-11-02', displayNum: '2', isCurrentMonth: false },
    { dateStr: '2023-11-03', displayNum: '3', isCurrentMonth: false },
    { dateStr: '2023-11-04', displayNum: '4', isCurrentMonth: false },
    { dateStr: '2023-11-05', displayNum: '5', isCurrentMonth: false },
  ];

export const CalendarGrid: React.FC<Props> = ({
  selectedDate,
  onSelectDate,
  journalDates,
}) => (
  <View style={styles.wrap}>
    <View style={styles.row}>
      {HEADERS.map((h, i) => (
        <View key={i} style={styles.cell}>
          <Text style={styles.header}>{h}</Text>
        </View>
      ))}
    </View>

    <View style={styles.grid}>
      {DAYS.map((day, idx) => {
        const isSelected = selectedDate === day.dateStr;
        const hasJournal = journalDates.includes(day.dateStr);
        return (
          <View key={idx} style={styles.cell}>
            <Pressable
              onPress={() => day.isCurrentMonth && onSelectDate(day.dateStr)}
              disabled={!day.isCurrentMonth}
              style={[styles.day, isSelected && styles.daySelected]}
            >
              <Text
                style={[
                  styles.dayText,
                  !day.isCurrentMonth && styles.dayMuted,
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
  dayText: { fontSize: 12, fontWeight: '700', color: colors.slate800 },
  dayMuted: { color: '#E2E8F0' },
  dayTextSelected: { color: colors.white },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.brand,
    marginTop: 2,
  },
});

export default CalendarGrid;
