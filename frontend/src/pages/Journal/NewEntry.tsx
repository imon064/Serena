import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, Calendar, Sparkles, Bold, Italic, List, Link as LinkIcon, Quote, Undo2, Plus, Save } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export const NewJournalEntry: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { addEntry, selectedDate } = useJournal();
  const queryDate = searchParams.get('date') || selectedDate;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('OKAY');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Grateful']);
  const [customTagInput, setCustomTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const moods = [
    { name: 'SAD', emoji: '😢', label: 'SAD' },
    { name: 'MEH', emoji: '😐', label: 'MEH' },
    { name: 'OKAY', emoji: '😊', label: 'OKAY' }, 
    { name: 'GOOD', emoji: '🙂', label: 'GOOD' },
    { name: 'GREAT', emoji: '😀', label: 'GREAT' },
  ];

  const initialTags = ['Grateful', 'Anxious', 'Hopeful', 'Productive', 'Tired'];

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleAddNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim() && !selectedTags.includes(newTagName.trim())) {
      setSelectedTags(prev => [...prev, newTagName.trim()]);
      setNewTagName('');
      setCustomTagInput(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an entry title.');
      return;
    }
    if (!content.trim()) {
      alert('Please write down your thoughts.');
      return;
    }

    addEntry({
      date: queryDate,
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood,
      tags: selectedTags,
      prompt: "What is one small thing that brought you peace today, no matter how brief?"
    });

    navigate(`/journal/detail/${queryDate}`);
  };

  const getFormattedDateLabel = () => {
    const dateObj = new Date(queryDate);

    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-lavender flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-card border border-slate-100/50 flex flex-col min-h-[780px] relative overflow-hidden animate-slideUp">
        
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-50">
          <button
            onClick={() => navigate('/journal')}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center border border-slate-100 transition-all duration-150 text-slate-500"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          
          <span className="text-base font-extrabold text-[#110B30]">
            New Entry
          </span>
          
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100/50 rounded-full px-3 py-1.5 text-xs font-bold text-slate-500">
            <span>{getFormattedDateLabel()}</span>
            <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center">
              <Calendar size={11} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6 text-left">
          
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              How are you feeling?
            </h3>
            <div className="flex justify-between items-center bg-slate-50/50 rounded-2xl p-2 border border-slate-100">
              {moods.map((m, i) => {
                const isActive = selectedMood === m.name;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedMood(m.name)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-brand text-white shadow-premium scale-105'
                        : 'text-slate-500 hover:bg-slate-100/60'
                    }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className={`text-[9px] font-extrabold tracking-wide uppercase ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}>
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-brand-light/35 border border-brand/5 rounded-2xl p-4 flex gap-3.5 relative overflow-hidden">
            <div className="text-brand flex-shrink-0 mt-0.5">
              <Sparkles size={18} className="fill-current text-brand animate-pulse" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-[10px] font-extrabold tracking-widest text-brand uppercase">
                Today's Prompt
              </span>
              <p className="text-xs font-bold text-slate-700 italic leading-relaxed">
                "What is one small thing that brought you peace today, no matter how brief?"
              </p>
            </div>

            <div className="flex flex-col gap-1 items-end justify-center opacity-10">
              <div className="w-6 h-1 bg-brand rounded-full" />
              <div className="w-10 h-1 bg-brand rounded-full" />
              <div className="w-4 h-1 bg-brand rounded-full" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Good Morning Entry, Quiet Evening"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-3.5 px-4 border border-gray-200 rounded-[14px] text-sm text-slate-900 bg-white placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Your Thoughts
              </label>

              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[10px] font-bold">Auto-saving</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              </div>
            </div>

            <div className="border border-slate-200 rounded-[18px] flex flex-col bg-white overflow-hidden shadow-sm">

              <div className="flex items-center gap-4 px-4 py-3 bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs">
                <button
                  type="button"
                  onClick={() => alert('Format Bold (Demo)')}
                  className="hover:text-brand transition-colors duration-150"
                  title="Bold"
                >
                  <Bold size={15} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => alert('Format Italic (Demo)')}
                  className="hover:text-brand transition-colors duration-150"
                  title="Italic"
                >
                  <Italic size={15} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => alert('Format List (Demo)')}
                  className="hover:text-brand transition-colors duration-150"
                  title="List"
                >
                  <List size={15} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => alert('Insert Link (Demo)')}
                  className="hover:text-brand transition-colors duration-150"
                  title="Link"
                >
                  <LinkIcon size={14} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => alert('Blockquote (Demo)')}
                  className="hover:text-brand transition-colors duration-150"
                  title="Quote"
                >
                  <Quote size={14} strokeWidth={2.5} />
                </button>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => {
                    if (content) {
                      setContent(c => c.slice(0, -10));
                    }
                  }}
                  className="hover:text-brand transition-colors duration-150"
                  title="Undo"
                >
                  <Undo2 size={15} strokeWidth={2.5} />
                </button>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing here..."
                rows={8}
                className="w-full p-4 text-sm text-slate-800 focus:outline-none resize-none bg-white min-h-[160px] leading-relaxed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Tags
              </span>
              {!customTagInput ? (
                <button
                  type="button"
                  onClick={() => setCustomTagInput(true)}
                  className="text-xs font-extrabold text-brand hover:text-brand-hover flex items-center gap-1 transition-colors duration-150"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Add New</span>
                </button>
              ) : (
                <form onSubmit={handleAddNewTag} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="New tag..."
                    className="border border-slate-200 rounded-md px-2 py-0.5 text-xs focus:outline-none focus:border-brand"
                    autoFocus
                  />
                  <button type="submit" className="text-[10px] font-bold text-brand uppercase">
                    Add
                  </button>
                </form>
              )}
            </div>

            <div className="flex flex-wrap gap-2">

              {initialTags.map((tag, idx) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ${
                      isSelected
                        ? 'bg-brand text-white shadow-sm border border-brand'
                        : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100/60'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}

              {selectedTags.filter(t => !initialTags.includes(t)).map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 bg-brand text-white shadow-sm border border-brand"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 w-full">
            <button
              onClick={handleSave}
              className="w-full py-4 px-6 rounded-2xl font-black text-base transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 bg-brand text-white shadow-premium hover:bg-brand-hover active:scale-[0.98]"
            >
              <Save size={18} strokeWidth={2.5} />
              <span>Save Entry</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default NewJournalEntry;
