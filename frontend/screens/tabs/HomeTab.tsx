import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../lib/theme';
import { useAuth } from '../../context/AuthContext';
import { getFirstName } from '../../lib/userName';
import { notify } from '../../lib/notify';

interface HomeTabProps {
  onNavigateToChat: () => void;
  onNavigateToJournal: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onNavigateToChat,
  onNavigateToJournal,
}) => {
  const { user } = useAuth();

  // First name of the signed-in user (from Supabase user metadata).
  const name = getFirstName(user);

  // Whether the daily reflection is bookmarked (local UI state).
  const [reflectionSaved, setReflectionSaved] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/100?img=11' }} 
              style={styles.avatarImage} 
            />
          </View>
          <View>
            <Text style={styles.greeting}>Hello {name}! 👋</Text>
            <Text style={styles.subtitle}>How are you feeling today?</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => notify("You're all caught up — no new notifications.")}
        >
          <Feather name="bell" size={20} color={colors.brand} />
        </TouchableOpacity>
      </View>

      {/* Serena AI Card */}
      <View style={styles.aiCard}>
        <View style={styles.aiIllustrationPlaceholder}>
          <Text style={styles.aiIllustrationText}>🤖☁️</Text>
        </View>
        <Text style={styles.aiCardTitle}>Talk with Serena AI</Text>
        <Text style={styles.aiCardDesc}>
          Share your thoughts, reduce stress, and receive supportive guidance anytime.
        </Text>
        <TouchableOpacity style={styles.aiCardButton} onPress={onNavigateToChat}>
          <Text style={styles.aiCardButtonText}>Start Conversation</Text>
        </TouchableOpacity>
      </View>

      {/* My Journal Card */}
      <View style={styles.journalCard}>
        <View style={styles.journalIllustrationPlaceholder}>
          <Text style={styles.journalIllustrationText}>📖✨</Text>
        </View>
        <Text style={styles.journalCardTitle}>My Journal</Text>
        <Text style={styles.journalCardDesc}>
          Capture today's thoughts, emotions, and reflections.
        </Text>
        <TouchableOpacity style={styles.journalCardButton} onPress={onNavigateToJournal}>
          <Text style={styles.journalCardButtonText}>Write Today's Journal</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Reflection Card */}
      <View style={styles.reflectionCard}>
        <View style={styles.reflectionIconContainer}>
          <Feather name="sun" size={20} color={colors.brand} />
        </View>
        <View style={styles.reflectionContent}>
          <Text style={styles.reflectionTitle}>Daily Reflection</Text>
          <Text style={styles.reflectionQuote}>"Every small step toward healing is still progress."</Text>
        </View>
        <TouchableOpacity onPress={() => setReflectionSaved((s) => !s)}>
          <Feather
            name="bookmark"
            size={20}
            color={reflectionSaved ? colors.brand : colors.slate400}
          />
        </TouchableOpacity>
      </View>

      {/* Yesterday's Journal Preview */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Yesterday</Text>
          <Text style={styles.historyDate}>Jul 24, 2026</Text>
        </View>
        <Text style={styles.historyPreview} numberOfLines={2}>
          I felt more relaxed after taking time to breathe. The morning meditation really...
        </Text>
        <TouchableOpacity style={styles.historyButton} onPress={onNavigateToJournal}>
          <Text style={styles.historyButtonText}>Continue Writing</Text>
          <Feather name="arrow-right" size={16} color={colors.brand} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 24,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.brand,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: colors.slate500,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brandFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCard: {
    backgroundColor: colors.brandCard,
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  aiIllustrationPlaceholder: {
    height: 140,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  aiIllustrationText: {
    fontSize: 60,
  },
  aiCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  aiCardDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 4,
  },
  aiCardButton: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  aiCardButtonText: {
    color: colors.brand,
    fontWeight: '600',
    fontSize: 14,
  },
  journalCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  journalIllustrationPlaceholder: {
    height: 120,
    backgroundColor: colors.brandFaint,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  journalIllustrationText: {
    fontSize: 60,
  },
  journalCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
  },
  journalCardDesc: {
    fontSize: 14,
    color: colors.slate500,
    lineHeight: 20,
    marginBottom: 4,
  },
  journalCardButton: {
    backgroundColor: colors.brand,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  journalCardButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  reflectionCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reflectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brandFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reflectionContent: {
    flex: 1,
    gap: 4,
  },
  reflectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.brand,
  },
  reflectionQuote: {
    fontSize: 14,
    color: colors.dark,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  historyDate: {
    fontSize: 13,
    color: colors.slate400,
  },
  historyPreview: {
    fontSize: 14,
    color: colors.slate500,
    lineHeight: 20,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.brand,
  },
});
