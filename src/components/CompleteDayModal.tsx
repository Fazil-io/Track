import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Lock, 
  Sparkles,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { DayStats } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';

interface CompleteDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  stats: DayStats;
  selectedDate: string;
}

export const CompleteDayModal: React.FC<CompleteDayModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  stats,
  selectedDate,
}) => {
  const [reflectionNotes, setReflectionNotes] = useState('');

  if (!isOpen) return null;

  const dateInfo = formatDisplayDate(selectedDate);
  const hasPendingTasks = stats.pending > 0;
  const isPerfectScore = stats.percentage === 100 && stats.total > 0;

  const handleConfirm = () => {
    onConfirm(reflectionNotes.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon and Title */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
            isPerfectScore 
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/25' 
              : hasPendingTasks
              ? 'bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/25'
              : 'bg-gradient-to-tr from-indigo-500 to-purple-400 shadow-indigo-500/25'
          }`}>
            {isPerfectScore ? (
              <Trophy className="w-6 h-6 animate-bounce" />
            ) : hasPendingTasks ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <CheckCircle className="w-6 h-6" />
            )}
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Complete Your Day
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {dateInfo.dayName}, {dateInfo.formattedDate}
            </p>
          </div>
        </div>

        {/* Stats Preview Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/60 my-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today's Final Statistics
            </span>
            <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
              {stats.percentage}% Completion
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                {stats.total}
              </div>
              <div className="text-[10px] font-medium text-slate-400 uppercase">
                Total Tasks
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {stats.completed}
              </div>
              <div className="text-[10px] font-medium text-slate-400 uppercase">
                Completed
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {stats.pending}
              </div>
              <div className="text-[10px] font-medium text-slate-400 uppercase">
                Pending
              </div>
            </div>
          </div>

          {/* Pending Warning Notice if tasks remain */}
          {hasPendingTasks ? (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <strong className="font-semibold">Notice:</strong> You have {stats.pending} uncompleted {stats.pending === 1 ? 'task' : 'tasks'}. Per your productivity rules, uncompleted tasks will <strong>NOT</strong> be automatically completed. Your actual completion rate of <strong>{stats.percentage}%</strong> will be permanently preserved.
              </div>
            </div>
          ) : stats.total > 0 ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Perfect discipline! All tasks are completed. You're ready to seal today's record.</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic text-center py-1">
              No tasks were added for this day.
            </div>
          )}
        </div>

        {/* Optional Reflection Note */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Daily Reflection / Wins (Optional)
          </label>
          <textarea
            value={reflectionNotes}
            onChange={(e) => setReflectionNotes(e.target.value)}
            placeholder="What went well today? What will you do better tomorrow?"
            rows={2}
            className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Note on locking */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-5">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Confirming will mark this day as complete and protect it against accidental edits.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-lg shadow-emerald-600/25 transition"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirm & Complete Day</span>
          </button>
        </div>

      </div>
    </div>
  );
};

