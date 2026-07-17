import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';
import { Icon } from './Icon';

interface Props {
  content?: string;
  mood?: string;
}

export const InsightCard: React.FC<Props> = ({ content, mood = 'Peaceful' }) => {
  const defaultInsight = `Your focus on mindful transitions and self-affirmation is showing great progress. By acknowledging your physical tension without judgment, you're practicing effective emotional regulation. Your '${mood}' mood is a reflection of this intentional morning ritual.`;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Icon name="sparkles" size={14} />
        <Text style={styles.label}>AI INSIGHT</Text>
      </View>
      <Text style={styles.body}>{content || defaultInsight}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.brandLight,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.brandTint,
    gap: 12,
    overflow: 'hidden',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: colors.brand },
  body: { fontSize: 12, color: colors.slate700, lineHeight: 20, fontWeight: '500' },
});

export default InsightCard;
