import React, { useState } from 'react';
import { JournalProvider, useJournal } from '../../context/JournalContext';
import { JournalCalendarScreen } from '../JournalCalendarScreen';
import { JournalEditorScreen } from '../JournalEditorScreen';
import { JournalDetailScreen } from '../JournalDetailScreen';

type View = 'journal' | 'new' | 'detail' | 'edit';

// The journal flow as a single tab inside MainScreen. It reuses the standalone
// journal screens but hides their built-in bottom nav (`hideNav`), because
// MainScreen already renders the app-wide nav bar. `onChangeTab` is required by
// those screens but never fires here since the nav is hidden.
const noop = () => {};

const JournalTabInner: React.FC = () => {
  const { selectedDate } = useJournal();
  const [view, setView] = useState<View>('journal');
  const [paramDate, setParamDate] = useState(selectedDate);

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
        hideNav
        onChangeTab={noop}
        onBack={() => setView('journal')}
        onEdit={(d) => {
          setParamDate(d);
          setView('edit');
        }}
      />
    );
  }

  return (
    <JournalCalendarScreen
      hideNav
      onChangeTab={noop}
      onBack={() => setView('journal')}
      onCreateEntry={(d) => {
        setParamDate(d);
        setView('new');
      }}
      onOpenEntry={(d) => {
        setParamDate(d);
        setView('detail');
      }}
    />
  );
};

export const JournalTab: React.FC = () => (
  <JournalProvider>
    <JournalTabInner />
  </JournalProvider>
);

export default JournalTab;
