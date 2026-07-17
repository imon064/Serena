import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../lib/theme';
import { HomeTab } from './tabs/HomeTab';
import { AIChatTab } from './tabs/AIChatTab';
import { ProfileTab } from './tabs/ProfileTab';
import { JournalTab } from './tabs/JournalTab';

type TabType = 'Home' | 'AIChat' | 'Journal' | 'Profile';

export const MainScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Home');

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeTab onNavigateToChat={() => setActiveTab('AIChat')} />;
      case 'AIChat':
        return <AIChatTab onNavigateToHome={() => setActiveTab('Home')} />;
      case 'Journal':
        return <JournalTab />;
      case 'Profile':
        return <ProfileTab />;
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'Home', icon: 'home', label: 'Home' },
    { id: 'AIChat', icon: 'message-square', label: 'AI Chat' },
    { id: 'Journal', icon: 'book', label: 'Journal' },
    { id: 'Profile', icon: 'user', label: 'Profile' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>
      
      <SafeAreaView edges={['bottom']} style={styles.navBar}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => setActiveTab(item.id)}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                <Feather
                  name={item.icon as any}
                  size={24}
                  color={isActive ? colors.brand : colors.slate400}
                />
              </View>
              <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  placeholderText: {
    fontSize: 18,
    color: colors.slate500,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: colors.brandLight,
  },
  navLabel: {
    fontSize: 11,
    color: colors.slate400,
    fontWeight: '500',
  },
  activeNavLabel: {
    color: colors.brand,
    fontWeight: '600',
  },
});
