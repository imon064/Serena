import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A single message shown in the chat. `sender` decides the bubble style.
export type UiMessage = { id: string; text: string; sender: 'user' | 'bot' };

// One saved conversation. `messages` holds only real turns (not the static
// greeting, which the UI draws on its own).
export interface ChatSession {
  id: string;
  title: string;
  messages: UiMessage[];
  updatedAt: number;
}

interface ChatContextType {
  sessions: ChatSession[]; // newest-updated first
  currentSessionId: string | null;
  currentMessages: UiMessage[];
  /** Start a fresh, blank conversation (shows the greeting again). */
  startNewChat: () => void;
  /** Reopen a past conversation from history. */
  openSession: (id: string) => void;
  /** Append a message to the current conversation (creating one if needed). */
  addMessage: (msg: UiMessage) => void;
}

const STORAGE_KEY = 'serena.chat.sessions.v1';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Turn the first thing the user said into a short, readable title.
function deriveTitle(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > 32 ? `${clean.slice(0, 32)}…` : clean || 'New chat';
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Don't write to storage until we've finished the first read, otherwise we'd
  // overwrite saved history with the empty initial state.
  const loaded = useRef(false);

  // Load saved history once on startup. We intentionally start on a blank new
  // chat (currentSessionId = null); past chats live in the history drawer.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSessions(JSON.parse(raw));
      } catch {
        // Corrupt/missing storage just means we start fresh.
      } finally {
        loaded.current = true;
      }
    })();
  }, []);

  // Persist whenever the conversations change.
  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)).catch(() => {});
  }, [sessions]);

  const currentMessages =
    sessions.find((s) => s.id === currentSessionId)?.messages ?? [];

  const startNewChat = () => setCurrentSessionId(null);

  const openSession = (id: string) => setCurrentSessionId(id);

  const addMessage = (msg: UiMessage) => {
    if (!currentSessionId) {
      // First message of a brand-new conversation: create the session.
      const id = `${Date.now()}`;
      const session: ChatSession = {
        id,
        title: msg.sender === 'user' ? deriveTitle(msg.text) : 'New chat',
        messages: [msg],
        updatedAt: Date.now(),
      };
      setCurrentSessionId(id);
      setSessions((prev) => [session, ...prev]);
      return;
    }

    setSessions((prev) =>
      prev
        .map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                messages: [...s.messages, msg],
                updatedAt: Date.now(),
                // Give the session a real title once the user speaks.
                title:
                  s.title === 'New chat' && msg.sender === 'user'
                    ? deriveTitle(msg.text)
                    : s.title,
              }
            : s
        )
        .sort((a, b) => b.updatedAt - a.updatedAt)
    );
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSessionId,
        currentMessages,
        startNewChat,
        openSession,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
};
