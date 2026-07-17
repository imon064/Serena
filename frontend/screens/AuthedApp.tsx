import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';
import { useAuth } from '../context/AuthContext';
import { JournalProvider, useJournal } from '../context/JournalContext';
import { BottomNav, Tab } from '../components/BottomNav';
import { Icon, IconName } from '../components/Icon';
import { JournalCalendarScreen } from './JournalCalendarScreen';
import { JournalEditorScreen } from './JournalEditorScreen';
import { JournalDetailScreen } from './JournalDetailScreen';

type Screen = 'home' | 'aichat' | 'profile' | 'journal' | 'new' | 'detail' | 'edit';

const Inner: React.FC = () => {
  const { selectedDate } = useJournal();
  const [view, setView] = useState<Screen>('journal');
  const [paramDate, setParamDate] = useState(selectedDate);

  const goTab = (tab: Tab) => setView(tab);

  if (view === 'journal') {
    return (
      <JournalCalendarScreen
        onBack={() => setView('home')}
        onCreateEntry={(d) => {
          setParamDate(d);
          setView('new');
        }}
        onOpenEntry={(d) => {
          setParamDate(d);
          setView('detail');
        }}
        onChangeTab={goTab}
      />
    );
  }

  if (view === 'new') {
    return (
      <JournalEditorScreen
        mode="new"
        date={paramDate}
        onClose={() => setView('journal')}
        onSaved={(d) => {
          setParamDate(d);
          setView('detail');
        }}
      />
    );
  }

  if (view === 'edit') {
    return (
      <JournalEditorScreen
        mode="edit"
        date={paramDate}
        onClose={() => setView('detail')}
        onSaved={() => setView('detail')}
      />
    );
  }

  if (view === 'detail') {
    return (
      <JournalDetailScreen
        date={paramDate}
        onBack={() => setView('journal')}
        onEdit={(d) => {
          setParamDate(d);
          setView('edit');
        }}
        onChangeTab={goTab}
      />
    );
  }

  // home / aichat / profile tabs
  return <TabScreen tab={view} onChangeTab={goTab} />;
};

const TAB_INFO: Record<
  'home' | 'aichat' | 'profile',
  { icon: IconName; title: string; body: string }
> = {
  home: {
    icon: 'home',
    title: 'Welcome back 🌿',
    body: 'Head to your Journal to reflect on today, or explore your mood trends.',
  },
  aichat: {
    icon: 'message',
    title: 'AI Chat',
    body: 'Your caring companion is coming soon — a friend who remembers your journal.',
  },
  profile: {
    icon: 'user',
    title: 'Your Profile',
    body: 'Profile settings are coming soon.',
  },
};

const TabScreen: React.FC<{
  tab: 'home' | 'aichat' | 'profile';
  onChangeTab: (t: Tab) => void;
}> = ({ tab, onChangeTab }) => {
  const { signOut } = useAuth();
  const info = TAB_INFO[tab];
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.center}>
          <View style={styles.iconTile}>
            <Icon name={info.icon} size={30} />
          </View>
          <Text style={styles.title}>{info.title}</Text>
          <Text style={styles.body}>{info.body}</Text>

          {tab === 'home' && (
            <Pressable
              onPress={() => onChangeTab('journal')}
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            >
              <Text style={styles.primaryText}>Open Journal</Text>
            </Pressable>
          )}
          {tab === 'profile' && (
            <Pressable onPress={signOut} style={styles.signOutBtn}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          )}
        </View>
        <BottomNav activeTab={tab} onChangeTab={onChangeTab} />
      </View>
    </View>
  );
};

export const AuthedApp: React.FC = () => (
  <JournalProvider>
    <Inner />
  </JournalProvider>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: {
    width: '100%',
    maxWidth: 420,
    flex: 1,
    maxHeight: 820,
    backgroundColor: colors.lavenderLight,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.slate100,
    overflow: 'hidden',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  iconTile: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.slate800 },
  body: { fontSize: 14, color: colors.slate500, textAlign: 'center', lineHeight: 21 },
  primaryBtn: { backgroundColor: colors.brand, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28, marginTop: 8 },
  primaryText: { color: colors.white, fontWeight: '800', fontSize: 15 },
  pressed: { backgroundColor: colors.brandHover },
  signOutBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 8,
  },
  signOutText: { color: colors.slate700, fontWeight: '700', fontSize: 15 },
});

export default AuthedApp;
