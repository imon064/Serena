import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

// Lightweight icon set using text glyphs / emoji so we don't depend on an
// icon font package. Monochrome glyphs respect `color`; emoji keep their own.
export type IconName =
  | 'back'
  | 'close'
  | 'chevronLeft'
  | 'chevronRight'
  | 'flame'
  | 'book'
  | 'sparkles'
  | 'calendar'
  | 'save'
  | 'share'
  | 'edit'
  | 'clock'
  | 'plus'
  | 'home'
  | 'chart'
  | 'user'
  | 'message'
  | 'bold'
  | 'italic'
  | 'list'
  | 'link'
  | 'quote'
  | 'undo';

const GLYPHS: Record<IconName, string> = {
  back: '←',
  close: '✕',
  chevronLeft: '‹',
  chevronRight: '›',
  flame: '🔥',
  book: '📖',
  sparkles: '✨',
  calendar: '📅',
  save: '✓',
  share: '↗',
  edit: '✎',
  clock: '🕐',
  plus: '+',
  home: '🏠',
  chart: '📊',
  user: '👤',
  message: '💬',
  bold: 'B',
  italic: 'I',
  list: '≡',
  link: '🔗',
  quote: '❝',
  undo: '↶',
};

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const Icon: React.FC<Props> = ({ name, size = 18, color, style }) => (
  <Text
    style={[
      { fontSize: size, lineHeight: size * 1.15, color, textAlign: 'center' },
      style,
    ]}
    selectable={false}
  >
    {GLYPHS[name] ?? '•'}
  </Text>
);

export default Icon;
