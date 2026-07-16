import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../lib/theme';

export const HomeScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const name =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email ??
    'there';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🌿</Text>
        <Text style={styles.title}>You're signed in!</Text>
        <Text style={styles.subtitle}>Welcome, {name}.</Text>
        <Text style={styles.note}>
          This is a placeholder home screen. Your journal, calendar and mood
          tracking screens can be built out from here next.
        </Text>
        <AppButton label="Sign Out" onPress={signOut} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 28,
    gap: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.slate100,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  emoji: { fontSize: 44 },
  title: { fontSize: 24, fontWeight: '800', color: colors.dark },
  subtitle: { fontSize: 15, color: colors.slate500 },
  note: {
    fontSize: 13,
    color: colors.slate400,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 19,
  },
});
