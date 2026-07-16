import React, { createContext, useContext, useState } from 'react';

export interface JournalEntry {
  date: string;
  title: string;
  content: string;
  mood: 'SAD' | 'MEH' | 'OKAY' | 'GOOD' | 'GREAT' | string;
  tags: string[];
  time: string;
  prompt?: string;
  readingTime: string;
}

interface JournalContextType {
  entries: Record<string, JournalEntry>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  streakCount: number;
  addEntry: (entry: Omit<JournalEntry, 'time' | 'readingTime'>) => void;
  updateEntry: (entry: JournalEntry) => void;
  getEntryForDate: (dateStr: string) => JournalEntry | undefined;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const DUMMY_ENTRIES: Record<string, JournalEntry> = {
  '2023-10-02': {
    date: '2023-10-02',
    title: 'Focus and Productivity',
    content: 'Started the morning with a clear plan. Worked through my top priorities without getting distracted. Felt a great sense of accomplishment by the end of the day.',
    mood: 'GOOD',
    tags: ['Productive', 'Grateful'],
    time: '9:00 AM',
    prompt: 'What was your biggest win today?',
    readingTime: '1 min read'
  },
  '2023-10-05': {
    date: '2023-10-05',
    title: 'A Bit Overwhelmed',
    content: 'Had a lot on my plate today. Felt a bit anxious about the upcoming project deadline. Taking some deep breaths and trying to break tasks down into smaller steps.',
    mood: 'MEH',
    tags: ['Anxious', 'Tired'],
    time: '4:15 PM',
    prompt: 'How can you show yourself kindness today?',
    readingTime: '2 min read'
  },
  '2023-10-11': {
    date: '2023-10-11',
    title: 'Midweek Reflection',
    content: 'Taking a moment to pause and reflect. The week is going by fast, but I am learning to appreciate the little breaks in between meetings. Feeling grounded and hopeful.',
    mood: 'OKAY',
    tags: ['Grateful', 'Hopeful'],
    time: '2:30 PM',
    prompt: 'What are you looking forward to this week?',
    readingTime: '1 min read'
  },
  '2023-10-20': {
    date: '2023-10-20',
    title: 'Relaxing Evening',
    content: 'Had a wonderful evening catching up with an old friend. It is nice to disconnect from work and just enjoy good conversation. Feeling very content.',
    mood: 'GREAT',
    tags: ['Grateful', 'Hopeful'],
    time: '8:45 PM',
    prompt: 'Who is someone you are glad is in your life?',
    readingTime: '2 min read'
  },
  '2023-10-24': {
    date: '2023-10-24',
    title: 'Good Morning Entry',
    content: 'Woke up feeling unusually calm today. The sunlight was filtering through the curtains in a way that made the whole room feel warm and safe. I took five deep breaths before even checking my phone, which is a big win for me.\n\nI noticed a slight tension in my shoulders when I thought about the meeting at 10 AM, but instead of letting it spiral, I acknowledged it and told myself, "I am prepared for whatever happens."',
    mood: 'OKAY', 
    tags: ['Grateful', 'Anxious', 'Hopeful'],
    time: '8:30 AM',
    prompt: 'What is one small thing that brought you peace today, no matter how brief?',
    readingTime: '2 min read'
  },
  '2023-10-28': {
    date: '2023-10-28',
    title: 'Weekend Calm',
    content: 'Woke up early and walked in the park. The cool autumn air was refreshing. Preparing for a restful weekend of reading and journaling.',
    mood: 'GOOD',
    tags: ['Grateful', 'Productive'],
    time: '7:15 AM',
    prompt: 'What outdoor activity brought you joy today?',
    readingTime: '1 min read'
  }
};

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Record<string, JournalEntry>>(DUMMY_ENTRIES);
  const [selectedDate, setSelectedDate] = useState<string>('2023-10-24'); 
  const [streakCount, setStreakCount] = useState<number>(24);

  const calculateReadingTime = (text: string): string => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const getFormattedTime = (): string => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const addEntry = (entry: Omit<JournalEntry, 'time' | 'readingTime'>) => {
    const time = getFormattedTime();
    const readingTime = calculateReadingTime(entry.content);
    
    setEntries((prev) => ({
      ...prev,
      [entry.date]: {
        ...entry,
        time,
        readingTime
      }
    }));

    
    setStreakCount((prev) => prev + 1);
  };

  const updateEntry = (updatedEntry: JournalEntry) => {
    const readingTime = calculateReadingTime(updatedEntry.content);
    setEntries((prev) => ({
      ...prev,
      [updatedEntry.date]: {
        ...updatedEntry,
        readingTime
      }
    }));
  };

  const getEntryForDate = (dateStr: string) => {
    return entries[dateStr];
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        selectedDate,
        setSelectedDate,
        streakCount,
        addEntry,
        updateEntry,
        getEntryForDate
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
