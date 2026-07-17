import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, TextInput, 
  ScrollView, Image, Modal, Animated, Dimensions, TouchableWithoutFeedback
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../lib/theme';
import { notify } from '../../lib/notify';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DUMMY_HISTORY = [
  { id: '1', title: 'Work Stress...', preview: 'I understand how that deadline...', time: '10:45 AM', date: 'TODAY' },
  { id: '2', title: 'Morning Anxiety', preview: 'That\'s a great observation...', time: '8:30 AM', date: 'TODAY' },
  { id: '3', title: 'Daily Check-in', preview: 'You\'ve made significant progress...', time: '9:15 PM', date: 'YESTERDAY' },
  { id: '4', title: 'Social Settings', preview: 'Remember the grounding...', time: '2:00 PM', date: 'YESTERDAY' },
];

export const AIChatTab: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.8)).current;
  
  // Chat state
  const [messages, setMessages] = useState<any[]>([]);
  const [showInitialGreeting, setShowInitialGreeting] = useState(true);
  const [inputText, setInputText] = useState('');

  const openDrawer = () => {
    setIsDrawerOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsDrawerOpen(false);
    });
  };

  const startNewSession = () => {
    setMessages([]);
    setShowInitialGreeting(true);
    closeDrawer();
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: inputText, sender: 'user' }]);
    setInputText('');
  };

  // Send a canned message (used by the emotion chips) as if the user typed it.
  const sendQuick = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text, sender: 'user' },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={openDrawer}>
          <Feather name="menu" size={24} color={colors.dark} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=5' }}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.botName}>Serena AI</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Always here for you</Text>
            </View>
          </View>
        </View>

        {/* Spacer keeps "Serena AI" centered now that the right-side button is gone. */}
        <View style={styles.headerIconButton} />
      </View>

      {/* Main Chat Area */}
      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {showInitialGreeting && (
          <>
            <View style={styles.dateSeparator}>
              <Text style={styles.dateSeparatorText}>TODAY</Text>
            </View>
            
            <View style={styles.botMessageRow}>
              <View style={styles.botMessageAvatar}>
                 <Text style={styles.botAvatarEmoji}>🤖</Text>
              </View>
              <View style={styles.botMessageBubble}>
                <Text style={styles.botMessageText}>
                  Hello Jason. I'm here to listen. How are you feeling right now?
                </Text>
              </View>
            </View>
            <Text style={styles.messageTime}>10:02 AM</Text>

            {/* Emotion Chips */}
            <View style={styles.chipsContainer}>
              <View style={styles.chipRow}>
                <TouchableOpacity style={styles.chip} onPress={() => sendQuick('😌 Peaceful')}>
                  <Text style={styles.chipText}>😌 Peaceful</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip} onPress={() => sendQuick('😵‍💫 Anxious')}>
                  <Text style={styles.chipText}>😵‍💫 Anxious</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chipRow}>
                <TouchableOpacity style={styles.chip} onPress={() => sendQuick('🌪️ Overwhelmed')}>
                  <Text style={styles.chipText}>🌪️ Overwhelmed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip} onPress={() => sendQuick('🌿 Reflective')}>
                  <Text style={styles.chipText}>🌿 Reflective</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Journal Entry Spotted Card */}
            <View style={styles.journalSpottedCard}>
              <View style={styles.journalSpottedHeader}>
                <Feather name="info" size={18} color={colors.brand} />
                <Text style={styles.journalSpottedTitle}>Journal Entry Spotted</Text>
              </View>
              <Text style={styles.journalSpottedText}>
                You mentioned feeling tired in your journal this morning. Would you like to talk about what's draining your energy?
              </Text>
              <View style={styles.cardLeftBorder} />
            </View>
          </>
        )}
        
        {messages.map((msg) => (
          <View key={msg.id} style={styles.userMessageRow}>
            <View style={styles.userMessageBubble}>
              <Text style={styles.userMessageText}>{msg.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => notify('Attachments are coming soon.')}
        >
          <Feather name="plus" size={24} color={colors.slate500} />
        </TouchableOpacity>
        
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor={colors.slate400}
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            style={styles.micButton}
            onPress={() => notify('Voice input is coming soon.')}
          >
            <Feather name="mic" size={20} color={colors.slate500} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
          onPress={sendMessage}
        >
          <Feather name="send" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Simulated Drawer using Modal */}
      {isDrawerOpen && (
        <Modal transparent visible={isDrawerOpen} animationType="none">
          <View style={styles.drawerOverlay}>
            <TouchableWithoutFeedback onPress={closeDrawer}>
              <View style={styles.drawerBackdrop} />
            </TouchableWithoutFeedback>
            
            <Animated.View style={[styles.drawerContent, { transform: [{ translateX: slideAnim }] }]}>
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>Chat History</Text>
                <TouchableOpacity onPress={closeDrawer}>
                  <Feather name="x" size={24} color={colors.dark} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.historyList}>
                <Text style={styles.historySectionTitle}>TODAY</Text>
                {DUMMY_HISTORY.filter(h => h.date === 'TODAY').map(item => (
                  <TouchableOpacity key={item.id} style={styles.historyItem} onPress={closeDrawer}>
                    <View style={styles.historyItemHeader}>
                      <Text style={styles.historyItemTitle}>{item.title}</Text>
                      <Text style={styles.historyItemTime}>{item.time}</Text>
                    </View>
                    <Text style={styles.historyItemPreview} numberOfLines={1}>{item.preview}</Text>
                  </TouchableOpacity>
                ))}

                <Text style={[styles.historySectionTitle, { marginTop: 20 }]}>YESTERDAY</Text>
                {DUMMY_HISTORY.filter(h => h.date === 'YESTERDAY').map(item => (
                  <TouchableOpacity key={item.id} style={styles.historyItem} onPress={closeDrawer}>
                    <View style={styles.historyItemHeader}>
                      <Text style={styles.historyItemTitle}>{item.title}</Text>
                      <Text style={styles.historyItemTime}>{item.time}</Text>
                    </View>
                    <Text style={styles.historyItemPreview} numberOfLines={1}>{item.preview}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.drawerFooter}>
                <TouchableOpacity style={styles.newSessionButton} onPress={startNewSession}>
                  <Feather name="plus" size={20} color={colors.white} />
                  <Text style={styles.newSessionText}>New Session</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerIconButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  botName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.brand,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981', // green
  },
  statusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 40,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparatorText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.slate400,
    backgroundColor: colors.brandFaint,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  botMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  botMessageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botAvatarEmoji: {
    fontSize: 16,
  },
  botMessageBubble: {
    backgroundColor: colors.brandFaint,
    padding: 16,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    flex: 1,
    maxWidth: '85%',
  },
  botMessageText: {
    fontSize: 15,
    color: colors.brand,
    lineHeight: 22,
    fontWeight: '500',
  },
  messageTime: {
    fontSize: 11,
    color: colors.slate400,
    marginLeft: 44,
    marginTop: 4,
    marginBottom: 24,
  },
  chipsContainer: {
    gap: 12,
    marginLeft: 44,
    marginBottom: 24,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 13,
    color: colors.brand,
    fontWeight: '500',
  },
  journalSpottedCard: {
    backgroundColor: colors.brandFaint,
    borderRadius: 16,
    padding: 16,
    marginLeft: 44,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  cardLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 3,
    backgroundColor: colors.brand,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  journalSpottedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  journalSpottedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  journalSpottedText: {
    fontSize: 13,
    color: colors.slate500,
    lineHeight: 20,
  },
  userMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  userMessageBubble: {
    backgroundColor: colors.brand,
    padding: 16,
    borderRadius: 20,
    borderTopRightRadius: 4,
    maxWidth: '85%',
  },
  userMessageText: {
    fontSize: 15,
    color: colors.white,
    lineHeight: 22,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brandFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
    paddingHorizontal: 16,
    height: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.dark,
    height: '100%',
  },
  micButton: {
    padding: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.slate400,
  },
  
  // Drawer Styles
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawerContent: {
    width: SCREEN_WIDTH * 0.8,
    maxWidth: 320,
    backgroundColor: colors.white,
    height: '100%',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // Safe area approx
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.brand,
  },
  historyList: {
    flex: 1,
    padding: 20,
  },
  historySectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.slate400,
    marginBottom: 16,
  },
  historyItem: {
    marginBottom: 20,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  historyItemTime: {
    fontSize: 11,
    color: colors.slate400,
  },
  historyItemPreview: {
    fontSize: 13,
    color: colors.slate500,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  newSessionButton: {
    backgroundColor: colors.brand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 100,
  },
  newSessionText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
