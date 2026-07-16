import React from 'react';

interface CalendarGridProps {
  selectedDate: string; 
  onSelectDate: (dateStr: string) => void;
  journalDates: string[]; 
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  selectedDate,
  onSelectDate,
  journalDates,
}) => {
  const headers = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const days = [
    { dateStr: '2023-09-24', displayNum: '24', isCurrentMonth: false },
    { dateStr: '2023-09-25', displayNum: '25', isCurrentMonth: false },
    { dateStr: '2023-09-26', displayNum: '26', isCurrentMonth: false },
    { dateStr: '2023-09-27', displayNum: '27', isCurrentMonth: false },
    { dateStr: '2023-09-28', displayNum: '28', isCurrentMonth: false },
    { dateStr: '2023-09-29', displayNum: '29', isCurrentMonth: false },
    { dateStr: '2023-10-01', displayNum: '1', isCurrentMonth: true },
    { dateStr: '2023-10-02', displayNum: '2', isCurrentMonth: true },
    { dateStr: '2023-10-03', displayNum: '3', isCurrentMonth: true },
    { dateStr: '2023-10-04', displayNum: '4', isCurrentMonth: true },
    { dateStr: '2023-10-05', displayNum: '5', isCurrentMonth: true },
    { dateStr: '2023-10-06', displayNum: '6', isCurrentMonth: true },
    { dateStr: '2023-10-07', displayNum: '7', isCurrentMonth: true },
    { dateStr: '2023-10-08', displayNum: '8', isCurrentMonth: true },
    { dateStr: '2023-10-09', displayNum: '9', isCurrentMonth: true },
    { dateStr: '2023-10-10', displayNum: '10', isCurrentMonth: true },
    { dateStr: '2023-10-11', displayNum: '11', isCurrentMonth: true },
    { dateStr: '2023-10-12', displayNum: '12', isCurrentMonth: true },
    { dateStr: '2023-10-13', displayNum: '13', isCurrentMonth: true },
    { dateStr: '2023-10-14', displayNum: '14', isCurrentMonth: true },
    { dateStr: '2023-10-15', displayNum: '15', isCurrentMonth: true },
    { dateStr: '2023-10-16', displayNum: '16', isCurrentMonth: true },
    { dateStr: '2023-10-17', displayNum: '17', isCurrentMonth: true },
    { dateStr: '2023-10-18', displayNum: '18', isCurrentMonth: true },
    { dateStr: '2023-10-19', displayNum: '19', isCurrentMonth: true },
    { dateStr: '2023-10-20', displayNum: '20', isCurrentMonth: true },
    { dateStr: '2023-10-21', displayNum: '21', isCurrentMonth: true },
    { dateStr: '2023-10-22', displayNum: '22', isCurrentMonth: true },
    { dateStr: '2023-10-23', displayNum: '23', isCurrentMonth: true },
    { dateStr: '2023-10-24', displayNum: '24', isCurrentMonth: true },
    { dateStr: '2023-10-25', displayNum: '25', isCurrentMonth: true },
    { dateStr: '2023-10-26', displayNum: '26', isCurrentMonth: true },
    { dateStr: '2023-10-27', displayNum: '27', isCurrentMonth: true },
    { dateStr: '2023-10-28', displayNum: '28', isCurrentMonth: true },
    { dateStr: '2023-10-29', displayNum: '29', isCurrentMonth: true },
    { dateStr: '2023-10-30', displayNum: '30', isCurrentMonth: true },
    { dateStr: '2023-10-31', displayNum: '31', isCurrentMonth: true },
    { dateStr: '2023-11-01', displayNum: '1', isCurrentMonth: false },
    { dateStr: '2023-11-02', displayNum: '2', isCurrentMonth: false },
    { dateStr: '2023-11-03', displayNum: '3', isCurrentMonth: false },
    { dateStr: '2023-11-04', displayNum: '4', isCurrentMonth: false },
    { dateStr: '2023-11-05', displayNum: '5', isCurrentMonth: false },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-7 text-center">
        {headers.map((h, i) => (
          <span key={i} className="text-xs font-bold text-slate-400">
            {h}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6 gap-y-3.5 text-center">
        {days.map((day, idx) => {
          const isSelected = selectedDate === day.dateStr;
          const hasJournal = journalDates.includes(day.dateStr);

          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-start relative min-h-[36px]"
            >
              <button
                type="button"
                onClick={() => onSelectDate(day.dateStr)}
                disabled={!day.isCurrentMonth}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
                  !day.isCurrentMonth
                    ? 'text-slate-200 cursor-default'
                    : isSelected
                    ? 'bg-brand text-white shadow-premium scale-105'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                {day.displayNum}
              </button>
              
              {hasJournal && (
                <span
                  className={`w-1 h-1 rounded-full absolute bottom-0 transition-colors duration-200 ${
                    isSelected ? 'bg-brand' : 'bg-brand'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
