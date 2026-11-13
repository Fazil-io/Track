import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  ListTodo, 
  TrendingUp,
  Award
} from 'lucide-react';
import { DayStats } from '../types';

interface OverviewCardsProps {
  stats: DayStats;
  isCompletedDay: boolean;
}

// Animated counter hook for smooth number transitions
function useAnimatedNumber(value: number, duration: number = 400) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = displayValue;
    const diff = value - startValue;

    if (diff === 0) return;

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + diff * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return displayValue;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ stats, isCompletedDay }) => {
  const animTotal = useAnimatedNumber(stats.total);
  const animCompleted = useAnimatedNumber(stats.completed);
  const animPending = useAnimatedNumber(stats.pending);
  const animPercentage = useAnimatedNumber(stats.percentage);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
      
      {/* 1. Total Tasks Card */}
      <div className="relative overflow-hidden group bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Tasks
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
            <ListTodo className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums font-sans">
            {animTotal}
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {stats.total === 1 ? 'task' : 'tasks'} today
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Planned for this session
        </div>
        {/* Subtle decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. Completed Tasks Card */}
      <div className="relative overflow-hidden group bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Completed
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight tabular-nums font-sans">
            {animCompleted}
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            done
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          {stats.completed > 0 ? 'Consistent execution' : 'Ready to start'}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 3. Pending Tasks Card */}
      <div className="relative overflow-hidden group bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pending
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight tabular-nums font-sans">
            {animPending}
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            remaining
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          {stats.pending === 0 && stats.total > 0 ? 'All finished! 🎉' : 'In the queue'}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 4. Daily Progress Percentage Card */}
      <div className="relative overflow-hidden group bg-gradient-to-br from-indigo-500/10 via-white to-purple-500/10 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/30 rounded-2xl p-4 sm:p-5 border border-indigo-200/80 dark:border-indigo-900/50 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Daily Progress
            </span>
            {isCompletedDay && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Saved
              </span>
            )}
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center transition-transform group-hover:scale-110">
            {stats.percentage === 100 && stats.total > 0 ? (
              <Award className="w-4 h-4 text-amber-500 animate-bounce" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
          </div>
        </div>
        
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight tabular-nums font-sans">
            {animPercentage}%
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            completion
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"
            style={{ width: `${Math.min(stats.percentage, 100)}%` }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80" />
      </div>

    </div>
  );
};

