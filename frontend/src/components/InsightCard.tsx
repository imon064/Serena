import React from 'react';
import { Sparkles } from 'lucide-react';

interface InsightCardProps {
  content?: string;
  mood?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ content, mood = 'Peaceful' }) => {
  const defaultInsight = `Your focus on mindful transitions and self-affirmation is showing great progress. By acknowledging your physical tension without judgment, you're practicing effective emotional regulation. Your '${mood}' mood is a reflection of this intentional morning ritual.`;

  return (
    <div className="relative w-full overflow-hidden bg-brand-light/45 rounded-3xl p-6 border border-brand/10 shadow-sm flex flex-col gap-3">
      <div className="absolute -top-1 -right-1 text-brand/10 pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor">
          <path d="M90,30 C80,30 70,20 70,10 C70,20 60,30 50,30 C60,30 70,40 70,50 C70,40 80,30 90,30 Z" />
          <path d="M40,70 C35,70 30,65 30,60 C30,65 25,70 20,70 C25,70 30,75 30,80 C30,75 35,70 40,70 Z" className="opacity-60" />
        </svg>
      </div>

      <div className="flex items-center gap-2 text-brand">
        <Sparkles size={16} className="fill-current" />
        <span className="text-[10px] font-extrabold tracking-wider uppercase">
          AI Insight
        </span>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed text-left font-medium">
        {content || defaultInsight}
      </p>
    </div>
  );
};

export default InsightCard;
