import React from 'react';

export const MoodChart: React.FC = () => {
  const chartData = [
    { day: 'M', height: '35%', active: false },
    { day: 'T', height: '50%', active: false },
    { day: 'W', height: '40%', active: false },
    { day: 'T', height: '90%', active: true, label: 'Today' }, // Highlighted Today (Thursday)
    { day: 'F', height: '55%', active: false },
    { day: 'S', height: '30%', active: false },
    { day: 'S', height: '45%', active: false },
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-800">Your Mood This Week</h3>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
            Trending: Positively upward
          </p>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold text-brand leading-none">84%</span>
          <p className="text-[9px] font-bold text-slate-400 tracking-wide uppercase mt-0.5">
            Overall Clarity
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between h-[120px] px-2 relative">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
            {item.active && (
              <span className="absolute -top-3 text-[10px] font-extrabold text-brand tracking-wide animate-pulse">
                {item.label}
              </span>
            )}
            
            <div className="w-6 bg-slate-100 hover:bg-slate-200/80 rounded-full h-[90px] flex items-end overflow-hidden transition-colors duration-200 cursor-pointer">
              <div
                style={{ height: item.height }}
                className={`w-full rounded-full transition-all duration-500 origin-bottom ${
                  item.active
                    ? 'bg-brand shadow-[0_4px_12px_rgba(109,62,245,0.3)]'
                    : 'bg-brand/20 group-hover:bg-brand/35'
                }`}
              />
            </div>
            
            <span
              className={`text-xs font-bold ${
                item.active ? 'text-brand font-extrabold' : 'text-slate-400'
              }`}
            >
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodChart;
