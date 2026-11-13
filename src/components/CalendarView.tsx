import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Award,
  Sparkles
} from 'lucide-react';
import { DayRecord } from '../types';
import { getMonthDays, formatDateKey } from '../utils/dateUtils';
import { calculateDayStats } from '../utils/storage';

interface CalendarViewProps {
  allDays: Record<string, DayRecord>;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  todayDate: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  allDays,
  selectedDate,
  onSelectDate,
  todayDate,
}) => {
  const [viewDate, setViewDate] = useState(() => new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthDays = getMonthDays(year, month);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleCurrentMonth = () => {
    setViewDate(new Date());
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
      
      {/* Month Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive consistency & productivity history
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCurrentMonth}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Current Month
          </button>
          
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 my-3 text-center">
        {weekDays.map((d) => (
          <div key={d} className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {monthDays.map((day) => {
          const record = allDays[day.dateKey];
          const stats = record ? calculateDayStats(record.tasks) : null;
          const isSelected = day.dateKey === selectedDate;
          const isToday = day.dateKey === todayDate;
          const hasData = stats && stats.total > 0;
          const isCompleted = record?.isCompletedDay;

          // Compute cell visual styling
          let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-400';
          if (hasData) {
            if (stats.percentage === 100) {
              badgeColor = 'bg-emerald-500 text-white font-bold';
            } else if (stats.percentage >= 70) {
              badgeColor = 'bg-teal-500 text-white font-bold';
            } else if (stats.percentage >= 40) {
              badgeColor = 'bg-indigo-500 text-white font-bold';
            } else if (stats.percentage > 0) {
              badgeColor = 'bg-amber-500 text-white font-bold';
            } else {
              badgeColor = 'bg-slate-400 text-white font-medium';
            }
          }

          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => onSelectDate(day.dateKey)}
              className={`relative min-h-[64px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                !day.isCurrentMonth
                  ? 'opacity-35 bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'
              } ${
                isSelected
                  ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-500 shadow-md'
                  : ''
              } ${
                isToday
                  ? 'border-indigo-500/70 font-semibold shadow-xs'
                  : ''
              }`}
            >
              {/* Top row: Day Number + Status Icon */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs sm:text-sm font-bold ${
                  isToday
                    ? 'inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px]'
                    : isSelected
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {day.dayNumber}
                </span>

                {isCompleted && (
                  <span title="Marked Completed Day">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </span>
                )}
              </div>

              {/* Bottom row: Percentage Pill or Empty state */}
              <div className="mt-1">
                {hasData ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${badgeColor} tabular-nums shadow-xs`}>
                        {stats.percentage}%
                      </span>
                    </div>
                    <div className="hidden sm:block text-[9px] text-slate-400 dark:text-slate-500 truncate">
                      {stats.completed}/{stats.total} done
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-300 dark:text-slate-600 italic">
                    —
                  </div>
                )}
              </div>

            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>100% Complete</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>40-99% Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>&lt;40% Tasks Done</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Completed Day Seal</span>
        </div>
      </div>

    </div>
  );
};

