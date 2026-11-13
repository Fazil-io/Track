import React, { useRef, useState } from 'react';
import { 
  Download, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Check, 
  Award, 
  X,
  FileImage,
  Loader2
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { DayStats, Task, Quote } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';
import { CATEGORY_MAP } from '../utils/categoryConfig';

interface ReportCardProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  tasks: Task[];
  stats: DayStats;
  quote: Quote;
  userName: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  isOpen,
  onClose,
  selectedDate,
  tasks,
  stats,
  quote,
  userName,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [themeStyle, setThemeStyle] = useState<'dark' | 'light'>('dark');

  if (!isOpen) return null;

  const dateInfo = formatDisplayDate(selectedDate);
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (stats.percentage / 100) * circumference;

  const handleDownload = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      
      // Allow fonts and SVGs to settle
      await new Promise((resolve) => setTimeout(resolve, 300));

      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        pixelRatio: 2.5, // Ultra-crisp for high-DPI Instagram / WhatsApp
        quality: 1,
        backgroundColor: themeStyle === 'dark' ? '#0b0f19' : '#f8fafc',
      });

      const link = document.createElement('a');
      link.download = `MyProgress_Report_${selectedDate}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate PNG report:', err);
      alert('Unable to generate image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto animate-scale-in">
        
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileImage className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Daily Report Preview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Optimized for WhatsApp & Instagram sharing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Style Selector */}
            <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setThemeStyle('dark')}
                className={`px-2.5 py-1 rounded-md transition ${
                  themeStyle === 'dark' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setThemeStyle('light')}
                className={`px-2.5 py-1 rounded-md transition ${
                  themeStyle === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Light
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container for Preview */}
        <div className="my-4 max-h-[60vh] overflow-y-auto p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80">
          
          {/* THE ACTUAL EXPORT CARD ELEMENT CAPTURED BY html-to-image */}
          <div
            ref={reportRef}
            className={`w-full max-w-[620px] mx-auto p-6 sm:p-8 rounded-3xl transition-colors ${
              themeStyle === 'dark'
                ? 'bg-gradient-to-b from-[#0e1424] via-[#090d16] to-[#040711] text-white border border-slate-800'
                : 'bg-gradient-to-b from-white via-slate-50 to-indigo-50/40 text-slate-900 border border-slate-200'
            }`}
          >
            {/* Top Branding & Date Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 dark:border-white/10 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-base font-extrabold tracking-tight">
                    My Progress
                  </div>
                  <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                    Daily Achievement Report
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold">
                  {dateInfo.dayName}
                </div>
                <div className="text-[11px] text-slate-400">
                  {dateInfo.formattedDate}
                </div>
              </div>
            </div>

            {/* Motivational Headline */}
            <div className="my-5 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {stats.percentage === 100 ? 'Flawless Execution' : 'Consistency Over Perfection'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {stats.percentage === 100
                  ? 'All Daily Goals Accomplished! 🏆'
                  : stats.percentage >= 75
                  ? 'Strong Discipline & High Output 🚀'
                  : 'Daily Action & Forward Momentum ⚡'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Tracked by <span className="font-semibold text-indigo-400">{userName}</span> • Small daily habits build monumental success.
              </p>
            </div>

            {/* Stats Grid + Pie Ring Chart */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 items-center bg-white/5 dark:bg-white/5 rounded-2xl p-4 border border-white/10">
              
              {/* Left: 4 Metrics */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/15">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Tasks</div>
                  <div className="text-2xl font-black mt-0.5">{stats.total}</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Completed</div>
                  <div className="text-2xl font-black text-emerald-400 mt-0.5">{stats.completed}</div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Pending</div>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">{stats.pending}</div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <div className="text-[10px] uppercase font-bold text-indigo-400">Success Rate</div>
                  <div className="text-2xl font-black text-indigo-400 mt-0.5">{stats.percentage}%</div>
                </div>
              </div>

              {/* Right: Pie Donut Progress Visual */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="text-slate-700/30"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke={stats.percentage === 100 ? '#10b981' : '#6366f1'}
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - stats.percentage / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-extrabold tracking-tight">{stats.percentage}%</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Done</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> {stats.completed} Done
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> {stats.pending} Pending
                  </span>
                </div>
              </div>

            </div>

            {/* List of All Tasks */}
            <div className="my-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                <span>Task Breakdown ({tasks.length})</span>
                <span>Status</span>
              </div>

              {tasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 italic">
                  No tasks recorded for this day.
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task, idx) => {
                    const cat = CATEGORY_MAP[task.category] || CATEGORY_MAP['Others'];
                    return (
                      <div
                        key={task.id || idx}
                        className={`flex items-center justify-between gap-3 p-2.5 rounded-xl text-xs border ${
                          task.completed
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                            task.completed ? 'bg-emerald-500 text-white' : 'border border-slate-500'
                          }`}>
                            {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          
                          <span className={`truncate font-medium ${
                            task.completed ? 'line-through text-slate-400' : 'text-current font-semibold'
                          }`}>
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                            {task.category}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            task.completed ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            {task.completed ? 'COMPLETED' : 'PENDING'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Motivational Quote & Signature Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-xs italic text-slate-400 max-w-lg mx-auto">
                "{quote.text}"
              </p>
              <div className="text-[11px] font-semibold text-indigo-400 mt-1">
                — {quote.author}
              </div>
              <div className="mt-3 text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                Generated with My Progress • Designed for Discipline & Daily Growth
              </div>
            </div>

          </div>

        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>
          
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PNG...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download High-Res PNG</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

