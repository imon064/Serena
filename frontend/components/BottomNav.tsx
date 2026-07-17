import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';
import { Icon, IconName } from './Icon';

export type Tab = 'home' | 'aichat' | 'journal' | 'profile';

interface Props {
  activeTab: Tab;
  onChangeTab?: (tab: Tab) => void;
}

const TABS: { key: Tab; icon: IconName; label: string }[] = [
  { key: 'home', icon: 'home', label: 'Home' },
  { key: 'aichat', icon: 'message', label: 'AI Chat' },
  { key: 'journal', icon: 'calendar', label: 'Journal' },
  { key: 'profile', icon: 'user', label: 'Profile' },
];

export const BottomNav: React.FC<Props> = ({ activeTab, onChangeTab }) => (
  <View style={styles.bar}>
    {TABS.map((t) => {
      const active = t.key === activeTab;
      return (
        <Pressable
          key={t.key}
          onPress={() => onChangeTab?.(t.key)}
          style={active ? styles.activePill : styles.iconBtn}
        >
          <Icon
            name={t.icon}
            size={active ? 16 : 20}
            color={active ? colors.white : colors.slate400}
          />
          {active && <Text style={styles.activeLabel}>{t.label}</Text>}
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  iconBtn: { padding: 8 },
  activePill: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  activeLabel: { color: colors.white, fontWeight: '700', fontSize: 12 },
});

export default BottomNav;
