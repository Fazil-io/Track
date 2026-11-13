import React, { useState } from 'react';
import { 
  Plus, 
  Tag, 
  AlignLeft, 
  Flag,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TaskCategory, TaskPriority } from '../types';
import { ALL_CATEGORIES, CATEGORY_MAP } from '../utils/categoryConfig';

interface TaskInputProps {
  onAddTask: (task: {
    title: string;
    description?: string;
    category: TaskCategory;
    priority?: TaskPriority;
  }) => void;
  disabled?: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, disabled }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Coding / DSA');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || disabled) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
    });

    setTitle('');
    setDescription('');
    // keep category and priority or default
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const activeCategoryConfig = CATEGORY_MAP[category];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50">
      <form onSubmit={handleSubmit}>
        
        {/* Main Title Input Row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "Day is completed (Locked for review)" : "What do you want to accomplish today? (e.g. Solve 3 LeetCode problems)"}
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed"
          />

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={disabled}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle more details"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>{isExpanded ? 'Less' : 'Details'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="submit"
            disabled={!title.trim() || disabled}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
          >
            <span>Add Task</span>
          </button>
        </div>

        {/* Expandable Options: Description, Category Pill Selector, Priority */}
        <div className={`mt-3 space-y-3 transition-all ${isExpanded || title.length > 0 ? 'block' : 'hidden sm:block'}`}>
          
          {/* Optional Description */}
          {isExpanded && (
            <div className="pt-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={disabled}
                placeholder="Optional notes, sub-tasks, or documentation links..."
                rows={2}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none transition"
              />
            </div>
          )}

          {/* Categories & Priority Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden md:inline">
                Category:
              </span>
              {ALL_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                const config = CATEGORY_MAP[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    disabled={disabled}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                      isSelected
                        ? `${config.badgeBg} ${config.badgeText} ${config.badgeBorder} shadow-sm font-semibold ring-1 ring-current`
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/70 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Priority Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
                Priority:
              </span>
              <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700/70">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      disabled={disabled}
                      className={`px-2 py-0.5 text-[11px] font-medium rounded-md capitalize transition ${
                        isSelected
                          ? p === 'high'
                            ? 'bg-rose-500 text-white font-semibold shadow-xs'
                            : p === 'medium'
                            ? 'bg-amber-500 text-white font-semibold shadow-xs'
                            : 'bg-emerald-500 text-white font-semibold shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </form>
    </div>
  );
};

