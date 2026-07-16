import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Pencil, Clock, Flame } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { InsightCard } from '../../components/InsightCard';
import { MoodChart } from '../../components/MoodChart';
import { BottomNav } from '../../components/BottomNav';

export const JournalDetail: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { getEntryForDate, streakCount } = useJournal();

  const entry = date ? getEntryForDate(date) : undefined;

  const handleShare = () => {
    alert('Share functionality (Demo only)');
  };

  const getFormattedDateLabel = () => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood?.toUpperCase()) {
      case 'SAD': return '😢';
      case 'MEH': return '😐';
      case 'OKAY': return '😊';
      case 'GOOD': return '🙂';
      case 'GREAT': return '😀';
      default: return '😊';
    }
  };

  const getMoodLabel = (mood: string) => {
 
    if (mood?.toUpperCase() === 'OKAY') return 'Peaceful';
    return mood?.charAt(0).toUpperCase() + mood?.slice(1).toLowerCase();
  };

  if (!entry) {
    return (
      <div className="min-h-screen bg-lavender flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] bg-white rounded-[32px] p-8 shadow-card text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Entry Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">We couldn't find a journal entry for {date}.</p>
          <button
            onClick={() => navigate('/journal')}
            className="bg-brand text-white py-3.5 px-6 rounded-xl font-bold hover:bg-brand-hover transition-all"
          >
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Mobile-first card container */}
      <div className="w-full max-w-[420px] bg-[#FAF9FF] rounded-[32px] shadow-card border border-slate-100/50 flex flex-col min-h-[780px] justify-between relative overflow-hidden animate-fadeIn">
        
        {/* Header bar */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between bg-white border-b border-slate-100/40">
          <button
            onClick={() => navigate('/journal')}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center border border-slate-100 transition-all duration-150 text-slate-600"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-base font-black text-[#110B30] tracking-tight leading-none">
              Serena
            </span>
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Journal Detail
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center transition-all text-slate-600"
              aria-label="Share"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => navigate(`/journal/edit/${date}`)}
              className="w-9 h-9 rounded-full bg-brand/10 border border-brand/10 flex items-center justify-center transition-all text-brand hover:bg-brand/20"
              aria-label="Edit"
            >
              <Pencil size={15} />
            </button>
          </div>
        </div>

        {/* Detail Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 text-left">
          
          {/* DateTime & Title Block */}
          <div>
            <span className="text-[11px] font-bold text-slate-400">
              {getFormattedDateLabel()} • {entry.time}
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1.5 mb-3 leading-tight">
              {entry.title}
            </h1>
            
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Mood Badge */}
              <div className="bg-brand/10 text-brand text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="text-sm">{getMoodEmoji(entry.mood)}</span>
                <span>{getMoodLabel(entry.mood)}</span>
              </div>
              
              {/* Reading Time */}
              <div className="bg-slate-100/70 border border-slate-200/50 text-slate-500 text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                <Clock size={13} className="text-slate-400" />
                <span>{entry.readingTime}</span>
              </div>
            </div>

            {/* Streak text */}
            <div className="flex items-center gap-1.5 text-brand mt-4">
              <Flame size={14} className="fill-current text-brand" />
              <span className="text-xs font-bold">
                Day {streakCount} streak
              </span>
            </div>
          </div>

          {/* Journal Text Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line text-left">
              {entry.content}
            </p>
          </div>

          {/* AI Insight Card */}
          <InsightCard mood={getMoodLabel(entry.mood)} />

          {/* Mood chart */}
          <MoodChart />

          {/* Edit Button secondary */}
          <div className="w-full mt-2">
            <button
              onClick={() => navigate(`/journal/edit/${date}`)}
              className="w-full py-4 px-6 rounded-2xl font-black text-base transition-all duration-200 border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Pencil size={16} className="text-slate-400" />
              <span>Edit Journal</span>
            </button>
          </div>

        </div>

        {/* Bottom Nav: active tab is Home to match Figma image 4 */}
        <BottomNav activeTab="home" />

      </div>
    </div>
  );
};

export default JournalDetail;
