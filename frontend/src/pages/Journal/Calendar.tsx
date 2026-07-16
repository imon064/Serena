import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Flame, BookOpen } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { useAuth } from '../../context/AuthContext';
import { CalendarGrid } from '../../components/CalendarGrid';
import { BottomNav } from '../../components/BottomNav';

export const JournalCalendar: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDate, setSelectedDate, entries, streakCount } = useJournal();
  const { signOut } = useAuth();


  const hasJournalForSelectedDate = !!entries[selectedDate];

  const handleActionClick = () => {
    if (hasJournalForSelectedDate) {
      navigate(`/journal/detail/${selectedDate}`);
    } else {
      navigate(`/journal/new?date=${selectedDate}`);
    }
  };

  const handleBackToLogin = async () => {
    if (confirm('Sign out and return to the login screen?')) {
      await signOut();
      navigate('/login');
    }
  };

  const journalDates = Object.keys(entries);
  const currentMonthEntriesCount = journalDates.filter(d => d.startsWith('2023-10')).length;

  return (
    <div className="min-h-screen bg-lavender flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[420px] bg-lavender-light rounded-[32px] shadow-card border border-slate-100 flex flex-col min-h-[780px] justify-between relative overflow-hidden animate-fadeIn">
        
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <button
            onClick={handleBackToLogin}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-all duration-150"
            aria-label="Back"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <span className="text-lg font-extrabold text-brand tracking-tight">
            Select Date
          </span>
        
          <div className="w-10 h-10" />
        </div>

      
        <div className="flex-1 px-6 pb-6 flex flex-col justify-start">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100/50 flex flex-col gap-6">
            
            <div className="flex justify-between items-start">
              <div className="text-left">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  October 2023
                </h2>

                <div className="flex items-center gap-1.5 text-brand mt-1">
                  <div className="bg-brand/10 p-0.5 rounded-md flex items-center justify-center">
                    <Flame size={12} className="fill-current text-brand" />
                  </div>
                  <span className="text-xs font-bold tracking-wide">
                    Day {streakCount} streak
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => alert('Previous month navigation (Demo only)')}
                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center transition-colors duration-150"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} className="text-slate-600" />
                </button>
                <button
                  onClick={() => alert('Next month navigation (Demo only)')}
                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center transition-colors duration-150"
                  aria-label="Next month"
                >
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
              </div>
            </div>

            <CalendarGrid
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              journalDates={journalDates}
            />
          </div>

          <div className="mt-5 w-full">
            <button
              onClick={handleActionClick}
              className="w-full py-4 px-6 rounded-2xl font-black text-base transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 bg-brand text-white shadow-premium hover:bg-brand-hover active:scale-[0.98]"
            >
              {hasJournalForSelectedDate ? 'Read Previous Journal' : '+ Create New Entry'}
            </button>
          </div>

          <div className="mt-5 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 leading-tight">
                Your October Reflection
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 mt-1 leading-none">
                {currentMonthEntriesCount} journals completed this month
              </p>
            </div>
          </div>
          
          <div className="mt-3.5 px-1 flex items-center justify-between text-[10px] font-bold text-slate-400/80 tracking-wide uppercase">
            <span>Total Entries: {journalDates.length}</span>
            <span>•</span>
            <span>Streak: {streakCount} Days</span>
            <span>•</span>
            <span>Mood: 😊 Calm</span>
          </div>

        </div>

        <BottomNav activeTab="journal" />

      </div>
    </div>
  );
};

export default JournalCalendar;
