import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../lib/theme';
import { useAuth } from '../../context/AuthContext';
import { getFullName } from '../../lib/userName';

export const ProfileTab: React.FC = () => {
  const { signOut, user } = useAuth();

  // Full name of the signed-in user (from Supabase user metadata).
  const name = getFullName(user);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerBrand}>Serena</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="bell" size={20} color={colors.brand} />
          </TouchableOpacity>
          <View style={styles.smallAvatar}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/100?img=11' }} 
              style={styles.avatarImage} 
            />
          </View>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.largeAvatarContainer}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100?img=11' }} 
            style={styles.largeAvatarImage} 
          />
          <View style={styles.badgeContainer}>
            <Feather name="check" size={12} color={colors.white} />
          </View>
        </View>
        <Text style={styles.profileName}>{name}</Text>
        <View style={styles.premiumBadge}>
          <Feather name="award" size={12} color={colors.dark} style={styles.premiumIcon} />
          <Text style={styles.premiumText}>Premium Member</Text>
        </View>
      </View>

      {/* Your Journey */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Journey</Text>
        
        <View style={styles.streakCard}>
          <View>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <Text style={styles.streakValue}>Day 24</Text>
          </View>
          <View style={styles.streakIconContainer}>
            <Feather name="target" size={24} color={colors.brand} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#E0F2FE' }]}>
              <Feather name="edit-2" size={18} color="#0284C7" />
            </View>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Journals</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: colors.brandLight }]}>
              <Feather name="message-square" size={18} color={colors.brand} />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>AI Chats</Text>
          </View>
        </View>
      </View>

      {/* Mood Insights */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mood Insights</Text>
          <Text style={styles.sectionAction}>Last 7 Days</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.chartContainer}>
            {/* Dummy Chart Bars */}
            <View style={styles.chartCol}>
              <View style={[styles.chartBar, { height: 40, backgroundColor: colors.brandLight }]} />
              <Text style={styles.chartLabel}>M</Text>
            </View>
            <View style={styles.chartCol}>
              <View style={[styles.chartBar, { height: 70, backgroundColor: colors.brand }]} />
              <Text style={styles.chartLabel}>T</Text>
            </View>
            <View style={styles.chartCol}>
              <View style={[styles.chartBar, { height: 50, backgroundColor: colors.brandLight }]} />
              <Text style={styles.chartLabel}>W</Text>
            </View>
            <View style={styles.chartCol}>
              <View style={[styles.chartBar, { height: 60, backgroundColor: colors.brandCard }]} />
              <Text style={styles.chartLabel}>T</Text>
            </View>
            <View style={styles.chartCol}>
              <View style={[styles.chartBar, { height: 90, backgroundColor: colors.brand }]} />
              <Text style={styles.chartLabel}>F</Text>
            </View>
            <View style={styles.chartCol}>
              <View style={[styles.chartBar, { height: 40, backgroundColor: colors.brandLight }]} />
              <Text style={styles.chartLabel}>S</Text>
            </View>
            <View style={styles.chartCol}>
              <Text style={styles.chartLabel}>S</Text>
            </View>
          </View>
          <Text style={styles.chartDesc}>
            Your mood has been <Text style={styles.chartDescBold}>consistently positive</Text> this week. Keep up the journaling!
          </Text>
        </View>
      </View>

      {/* Menu List */}
      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#E0F2FE' }]}>
            <Feather name="settings" size={18} color="#0284C7" />
          </View>
          <Text style={styles.menuLabel}>Account Settings</Text>
          <Feather name="chevron-right" size={20} color={colors.slate400} />
        </TouchableOpacity>
        
        <View style={styles.menuDivider} />
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: colors.brandLight }]}>
            <Feather name="bell" size={18} color={colors.brand} />
          </View>
          <Text style={styles.menuLabel}>Notification Preferences</Text>
          <Feather name="chevron-right" size={20} color={colors.slate400} />
        </TouchableOpacity>
        
        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#E0F2FE' }]}>
            <Feather name="credit-card" size={18} color="#0284C7" />
          </View>
          <Text style={styles.menuLabel}>Subscription Plan</Text>
          <Feather name="chevron-right" size={20} color={colors.slate400} />
        </TouchableOpacity>
        
        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: colors.brandLight }]}>
            <Feather name="lock" size={18} color={colors.brand} />
          </View>
          <Text style={styles.menuLabel}>Privacy & Security</Text>
          <Feather name="chevron-right" size={20} color={colors.slate400} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#E0F2FE' }]}>
            <Feather name="help-circle" size={18} color="#0284C7" />
          </View>
          <Text style={styles.menuLabel}>Help & Support</Text>
          <Feather name="chevron-right" size={20} color={colors.slate400} />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Feather name="log-out" size={18} color={colors.red} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerBrand: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.brand,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileSection: {
    alignItems: 'center',
    gap: 8,
  },
  largeAvatarContainer: {
    position: 'relative',
  },
  largeAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.brand,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.brand,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 6,
  },
  premiumIcon: {
    opacity: 0.7,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.brand,
  },
  streakCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakLabel: {
    fontSize: 13,
    color: colors.slate500,
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.brand,
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
  },
  statLabel: {
    fontSize: 13,
    color: colors.slate500,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  chartCol: {
    alignItems: 'center',
    gap: 8,
    width: 24,
  },
  chartBar: {
    width: 20,
    borderRadius: 10,
    backgroundColor: colors.brandLight,
  },
  chartLabel: {
    fontSize: 12,
    color: colors.slate400,
    fontWeight: '500',
  },
  chartDesc: {
    fontSize: 14,
    color: colors.slate500,
    lineHeight: 22,
  },
  chartDescBold: {
    color: colors.brand,
    fontWeight: '600',
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 68,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.red,
  },
});
