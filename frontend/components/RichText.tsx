import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { colors } from '../lib/theme';

interface Props {
  content: string;
  // Base text style (size / colour / line-height) the formatting builds on.
  baseStyle?: StyleProp<TextStyle>;
}

// Matches the inline markers the editor's toolbar inserts:
//   **bold**   *italic*   [text](url)
// Bold is listed first so `**x**` is consumed before the italic rule sees it.
const INLINE = /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;

  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(<Text key={`${keyPrefix}-t${i++}`}>{text.slice(last, m.index)}</Text>);
    }
    const tok = m[0];
    if (tok.startsWith('**')) {
      nodes.push(
        <Text key={`${keyPrefix}-b${i++}`} style={styles.bold}>
          {tok.slice(2, -2)}
        </Text>
      );
    } else if (tok.startsWith('[')) {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok);
      nodes.push(
        <Text key={`${keyPrefix}-l${i++}`} style={styles.link}>
          {mm ? mm[1] : tok}
        </Text>
      );
    } else {
      nodes.push(
        <Text key={`${keyPrefix}-i${i++}`} style={styles.italic}>
          {tok.slice(1, -1)}
        </Text>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) {
    nodes.push(<Text key={`${keyPrefix}-t${i++}`}>{text.slice(last)}</Text>);
  }
  return nodes;
}

/**
 * Renders lightweight markdown produced by the journal editor's toolbar:
 * **bold**, *italic*, [text](url), `> ` block quotes and `- ` bullet lists.
 * Everything else is shown as plain paragraphs.
 */
export const RichText: React.FC<Props> = ({ content, baseStyle }) => {
  const lines = content.split('\n');

  return (
    <View>
      {lines.map((line, idx) => {
        const key = `line-${idx}`;

        if (line.startsWith('> ')) {
          return (
            <View key={key} style={styles.quoteRow}>
              <View style={styles.quoteBar} />
              <Text style={[baseStyle, styles.quoteText]}>
                {renderInline(line.slice(2), key)}
              </Text>
            </View>
          );
        }

        if (line.startsWith('- ')) {
          return (
            <View key={key} style={styles.liRow}>
              <Text style={[baseStyle, styles.bullet]}>{'•'}</Text>
              <Text style={[baseStyle, styles.liText]}>
                {renderInline(line.slice(2), key)}
              </Text>
            </View>
          );
        }

        // Blank line -> small vertical gap between paragraphs.
        if (line.trim() === '') {
          return <View key={key} style={styles.gap} />;
        }

        return (
          <Text key={key} style={baseStyle}>
            {renderInline(line, key)}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bold: { fontWeight: '800' },
  italic: { fontStyle: 'italic' },
  link: { color: colors.brand, textDecorationLine: 'underline' },
  gap: { height: 10 },
  quoteRow: { flexDirection: 'row', gap: 10, marginVertical: 4 },
  quoteBar: { width: 3, borderRadius: 2, backgroundColor: colors.brand },
  quoteText: { flex: 1, fontStyle: 'italic', color: colors.slate500 },
  liRow: { flexDirection: 'row', gap: 8, marginVertical: 2 },
  bullet: { color: colors.brand },
  liText: { flex: 1 },
});

export default RichText;
