import React from 'react';
import { 
  CalendarCheck, 
  Target, 
  Award, 
  Zap,
  TrendingUp,
  Flame
} from 'lucide-react';
import { DayRecord } from '../types';
import { calculateDayStats } from '../utils/storage';
import { parseDateKey } from '../utils/dateUtils';

interface MonthlyStatsProps {
  allDays: Record<string, DayRecord>;
  currentMonthDate: Date;
}

export const MonthlyStats: React.FC<MonthlyStatsProps> = ({
  allDays,
  currentMonthDate,
}) => {
  const currentYear = currentMonthDate.getFullYear();
  const currentMonth = currentMonthDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter records belonging to this month
  const monthRecords = Object.values(allDays).filter((record) => {
    const d = parseDateKey(record.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  let totalTasksInMonth = 0;
  let totalCompletedInMonth = 0;
  let totalPercentageSum = 0;
  let recordedDaysCount = 0;
  let successfullyCompletedDaysCount = 0;

  monthRecords.forEach((record) => {
    const stats = calculateDayStats(record.tasks);
    if (stats.total > 0) {
      totalTasksInMonth += stats.total;
      totalCompletedInMonth += stats.completed;
      totalPercentageSum += stats.percentage;
      recordedDaysCount += 1;
    }
    if (record.isCompletedDay) {
      successfullyCompletedDaysCount += 1;
    }
  });

  const averageDailyPercentage = recordedDaysCount > 0
    ? Math.round(totalPercentageSum / recordedDaysCount)
    : 0;

  const monthName = monthNames[currentMonth];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {monthName} {currentYear} Summary
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monthly aggregate discipline & performance
          </p>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>{recordedDaysCount} Days Active</span>
        </span>
      </div>

      {/* 3 Main Monthly Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        
        {/* Metric 1: Average Daily Completion */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg. Completion</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums">
            {averageDailyPercentage}%
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Across {recordedDaysCount} active days
          </div>
        </div>

        {/* Metric 2: Total Completed Tasks */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Tasks Finished</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight tabular-nums">
            {totalCompletedInMonth}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Out of {totalTasksInMonth} total tasks
          </div>
        </div>

        {/* Metric 3: Successfully Completed Days */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Completed Days</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight tabular-nums">
            {successfullyCompletedDaysCount}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Sealed & confirmed days
          </div>
        </div>

      </div>

      {/* Motivational insight footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>
            {averageDailyPercentage >= 75
              ? 'Terrific momentum! You are crushing your goals.'
              : averageDailyPercentage >= 50
              ? 'Good steady progress. Stay focused on daily closure.'
              : 'Keep going! Small daily improvements accumulate rapidly.'}
          </span>
        </div>
      </div>

    </div>
  );
};

