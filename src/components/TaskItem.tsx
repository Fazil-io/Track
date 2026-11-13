import React from 'react';
import { 
  Check, 
  Trash2, 
  Edit3, 
  Clock, 
  Flag,
  FileText
} from 'lucide-react';
import { Task } from '../types';
import { CATEGORY_MAP } from '../utils/categoryConfig';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  disabled,
}) => {
  const catConfig = CATEGORY_MAP[task.category] || CATEGORY_MAP['Others'];

  const getPriorityBadge = () => {
    if (!task.priority) return null;
    switch (task.priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40">
            <Flag className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
            <Flag className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
            Med
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
            <Flag className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
            Low
          </span>
        );
    }
  };

  return (
    <div
      className={`group relative flex items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80 task-completed'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-800/80 hover:shadow-md'
      }`}
    >
      {/* Left: Checkbox & Content */}
      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
        
        {/* Custom Animated Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          disabled={disabled}
          aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
          className={`mt-0.5 sm:mt-0 flex items-center justify-center w-5 h-5 rounded-lg border transition-all duration-200 shrink-0 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-slate-800'
          } ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer active:scale-90'}`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Title, Category & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Title with animated strikethrough */}
            <span
              onClick={() => !disabled && onToggle(task.id)}
              className={`text-sm sm:text-base font-medium cursor-pointer transition-colors ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {task.title}
            </span>

            {/* Category badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${catConfig.badgeBg} ${catConfig.badgeText} ${catConfig.badgeBorder}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${catConfig.dotColor}`} />
              {task.category}
            </span>

            {/* Priority Badge */}
            {getPriorityBadge()}
          </div>

          {/* Description if present */}
          {task.description && (
            <p className={`mt-1 text-xs line-clamp-2 ${
              task.completed ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-500 dark:text-slate-400'
            }`}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Right: Action Buttons (Edit / Delete) */}
      {!disabled && (
        <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

