import React from 'react';
import { 
  Sparkles, 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Calendar as CalendarIcon,
  Flame,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Quote } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';

interface HeaderProps {
  selectedDate: string;
  todayDate: string;
  quote: Quote;
  onOpenSettings: () => void;
  onSelectToday: () => void;
  streakCount: number;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  todayDate,
  quote,
  onOpenSettings,
  onSelectToday,
  streakCount,
  userName,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const dateInfo = formatDisplayDate(selectedDate);
  const isViewingToday = selectedDate === todayDate;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/20">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                    My Progress
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                    <Sparkles className="w-3 h-3" />
                    Pro
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    <strong className="text-slate-700 dark:text-slate-300">{dateInfo.dayName}</strong>, {dateInfo.formattedDate}
                  </span>
                  {!isViewingToday && (
                    <span className="inline-flex items-center px-2 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Viewing Past Date
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
              </button>
              <button
                onClick={onOpenSettings}
                aria-label="Settings"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Motivational Quote pill & User Actions */}
          <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4">
            
            {/* Quote Pill */}
            <div className="hidden lg:flex items-center gap-2.5 max-w-lg px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="truncate italic">
                "{quote.text}" <span className="not-italic text-slate-400 dark:text-slate-500 font-semibold">— {quote.author}</span>
              </p>
            </div>

            {/* Streak Counter badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/50 text-orange-700 dark:text-orange-400 text-xs font-semibold shadow-sm">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
              <span>{streakCount} {streakCount === 1 ? 'Day' : 'Days'} Streak</span>
            </div>

            {/* Past Date Banner / Back to Today button */}
            {!isViewingToday && (
              <button
                onClick={onSelectToday}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Today</span>
              </button>
            )}

            {/* Theme Toggle & Settings for Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>

              <button
                onClick={onOpenSettings}
                aria-label="Settings"
                title="Settings & Profile"
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 transition text-xs font-medium"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {userName.charAt(0).toUpperCase() || 'P'}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{userName}</span>
                <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Quote banner below header */}
        <div className="lg:hidden mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 not-italic" />
          <span className="truncate">"{quote.text}" — {quote.author}</span>
        </div>

      </div>
    </header>
  );
};

