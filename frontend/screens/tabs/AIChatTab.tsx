import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, TextInput,
  ScrollView, Modal, Animated, Dimensions, TouchableWithoutFeedback
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../lib/theme';
import { notify } from '../../lib/notify';
import { sendChat, type ChatMessage } from '../../lib/ai';
import { supabase } from '../../lib/supabase';
import { getFirstName } from '../../lib/userName';
import { useChat, type UiMessage } from '../../context/ChatContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Turn a stored timestamp into a friendly "10:45 AM" label for the drawer.
const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

export const AIChatTab: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.8)).current;

  // Chat state lives in a shared provider so it survives switching tabs and
  // app restarts, and powers the history drawer.
  const {
    sessions,
    currentSessionId,
    currentMessages: messages,
    startNewChat,
    openSession,
    addMessage,
  } = useChat();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [firstName, setFirstName] = useState('there');

  // Show the greeting + emotion chips whenever the current chat is empty.
  const showInitialGreeting = messages.length === 0;

  // Ref to the chat scroll view so we can scroll to the newest message.
  const scrollRef = useRef<ScrollView>(null);

  // The AI's opening line. Kept here so we can also feed it to the model as
  // context, so it remembers how the conversation began.
  const greetingText = `Hello ${firstName}. I'm here to listen. How are you feeling right now?`;

  // Grab the signed-in user's first name for a warm, personal greeting.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setFirstName(getFirstName(data.user));
    });
  }, []);

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
    startNewChat();
    closeDrawer();
  };

  const handleOpenSession = (id: string) => {
    openSession(id);
    closeDrawer();
  };

  // Core send routine: append the user's message, ask GPT (via our Edge
  // Function) for a reply, then append Serena's response.
  const send = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || isSending) return;

    const userMsg: UiMessage = {
      id: `${Date.now()}-user`,
      text,
      sender: 'user',
    };
    // Capture the conversation *before* this message for the API history.
    const nextMessages = [...messages, userMsg];
    addMessage(userMsg);
    setInputText('');
    setIsSending(true);

    // Build the conversation for OpenAI: the greeting first (so Serena has
    // context), then every message shown in the UI.
    const history: ChatMessage[] = [
      { role: 'assistant', content: greetingText },
      ...nextMessages.map((m): ChatMessage => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    try {
      const reply = await sendChat(history, firstName);
      addMessage({ id: `${Date.now()}-bot`, text: reply, sender: 'bot' });
    } catch (err) {
      // Keep the failure gentle and on-brand rather than a scary error.
      addMessage({
        id: `${Date.now()}-bot`,
        text: "I'm having a little trouble connecting right now. Let's take a slow breath together, and try again in a moment. 🌿",
        sender: 'bot',
      });
    } finally {
      setIsSending(false);
    }
  };

  const sendMessage = () => send(inputText);

  // Send a canned message (used by the emotion chips) as if the user typed it.
  const sendQuick = (text: string) => send(text);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={openDrawer}>
          <Feather name="menu" size={24} color={colors.dark} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <View style={styles.avatarContainer}>
            <Feather name="message-circle" size={20} color={colors.brand} />
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
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {showInitialGreeting && (
          <>
            <View style={styles.dateSeparator}>
              <Text style={styles.dateSeparatorText}>TODAY</Text>
            </View>
            
            <View style={styles.botMessageRow}>
              <View style={styles.botMessageAvatar}>
                 <Feather name="message-circle" size={16} color={colors.brand} />
              </View>
              <View style={styles.botMessageBubble}>
                <Text style={styles.botMessageText}>
                  {greetingText}
                </Text>
              </View>
            </View>
            <Text style={styles.messageTime}>10:02 AM</Text>

            {/* Emotion Chips + Journal card — only before the conversation begins */}
            {messages.length === 0 && (
            <>
            <View style={styles.chipsContainer}>
              <View style={styles.chipRow}>
                <TouchableOpacity style={styles.chip} onPress={() => sendQuick('😌 Peaceful')}>
                  <Text style={styles.chipText}>😌 Peaceful</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip} onPress={() => sendQuick('😟 Anxious')}>
                  <Text style={styles.chipText}>😟 Anxious</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chipRow}>
                <TouchableOpacity style={styles.chip} onPress={() => sendQuick('😩 Overwhelmed')}>
                  <Text style={styles.chipText}>😩 Overwhelmed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip} onPress={() => sendQuick('🙂 Reflective')}>
                  <Text style={styles.chipText}>🙂 Reflective</Text>
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
          </>
        )}

        {messages.map((msg) =>
          msg.sender === 'user' ? (
            <View key={msg.id} style={styles.userMessageRow}>
              <View style={styles.userMessageBubble}>
                <Text style={styles.userMessageText}>{msg.text}</Text>
              </View>
            </View>
          ) : (
            <View key={msg.id} style={styles.botMessageRow}>
              <View style={styles.botMessageAvatar}>
                <Feather name="message-circle" size={16} color={colors.brand} />
              </View>
              <View style={styles.botMessageBubble}>
                <Text style={styles.botMessageText}>{msg.text}</Text>
              </View>
            </View>
          )
        )}

        {/* "Serena is typing…" indicator while we wait for GPT */}
        {isSending && (
          <View style={styles.botMessageRow}>
            <View style={styles.botMessageAvatar}>
              <Feather name="message-circle" size={16} color={colors.brand} />
            </View>
            <View style={styles.botMessageBubble}>
              <Text style={styles.typingText}>Serena is typing…</Text>
            </View>
          </View>
        )}
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
          style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isSending}
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
                {sessions.length === 0 ? (
                  <Text style={styles.historyEmpty}>
                    No past chats yet. Start a conversation and it will appear here.
                  </Text>
                ) : (
                  sessions.map((session) => {
                    const last = session.messages[session.messages.length - 1];
                    const isActive = session.id === currentSessionId;
                    return (
                      <TouchableOpacity
                        key={session.id}
                        style={[styles.historyItem, isActive && styles.historyItemActive]}
                        onPress={() => handleOpenSession(session.id)}
                      >
                        <View style={styles.historyItemHeader}>
                          <Text style={styles.historyItemTitle} numberOfLines={1}>
                            {session.title}
                          </Text>
                          <Text style={styles.historyItemTime}>
                            {formatTime(session.updatedAt)}
                          </Text>
                        </View>
                        <Text style={styles.historyItemPreview} numberOfLines={1}>
                          {last?.text ?? ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                )}
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
    backgroundColor: colors.brandFaint,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
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
  typingText: {
    fontSize: 15,
    color: colors.slate400,
    lineHeight: 22,
    fontStyle: 'italic',
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
  historyItemActive: {
    backgroundColor: colors.brandFaint,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: -12,
    marginBottom: 8,
  },
  historyEmpty: {
    fontSize: 13,
    color: colors.slate400,
    lineHeight: 20,
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
