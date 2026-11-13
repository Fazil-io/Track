import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  Download, 
  Sparkles, 
  Lock, 
  Unlock, 
  PlusCircle, 
  ListFilter,
  CheckCheck,
  CalendarPlus,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Task, TaskCategory, DayStats } from '../types';
import { TaskInput } from './TaskInput';
import { TaskItem } from './TaskItem';
import { TaskFilters, StatusFilter } from './TaskFilters';
import { CelebrationBanner } from './CelebrationBanner';

interface TaskListProps {
  tasks: Task[];
  stats: DayStats;
  isCompletedDay: boolean;
  onAddTask: (task: {
    title: string;
    description?: string;
    category: TaskCategory;
    priority?: any;
  }) => void;
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCompleteDay: () => void;
  onUnlockDay: () => void;
  onOpenReport: () => void;
  onStartNewDay: () => void;
  isToday: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  stats,
  isCompletedDay,
  onAddTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onCompleteDay,
  onUnlockDay,
  onOpenReport,
  onStartNewDay,
  isToday,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (statusFilter === 'completed' && !task.completed) return false;
      if (statusFilter === 'pending' && task.completed) return false;

      // Category filter
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="space-y-5">
      
      {/* 100% Celebration Banner */}
      <CelebrationBanner stats={stats} isCompletedDay={isCompletedDay} />

      {/* Completed Day Notice & Controls */}
      {isCompletedDay && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
              <CheckCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  Day Completed & Archived
                </h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              </div>
              <p className="text-xs text-emerald-700/90 dark:text-emerald-300/80 mt-0.5">
                Saved with {stats.completed}/{stats.total} tasks completed ({stats.percentage}% score).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onUnlockDay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              title="Unlock to make changes"
            >
              <Unlock className="w-3.5 h-3.5 text-slate-400" />
              <span>Unlock to Edit</span>
            </button>

            <button
              onClick={onStartNewDay}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Track New Day</span>
            </button>
          </div>
        </div>
      )}

      {/* Task Input Section */}
      <TaskInput onAddTask={onAddTask} disabled={isCompletedDay} />

      {/* Action Buttons Toolbar: "Complete My Day" & "Download Daily Report" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        
        {/* Left: Section Header with counts */}
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Daily Tasks
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {/* Right: Key Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          
          {/* Download Daily Report Button */}
          <button
            type="button"
            onClick={onOpenReport}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Download Daily Report</span>
          </button>

          {/* Complete My Day Button */}
          {!isCompletedDay ? (
            <button
              type="button"
              onClick={onCompleteDay}
              disabled={tasks.length === 0}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white shadow-md shadow-emerald-600/25 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Complete My Day</span>
            </button>
          ) : (
            <div className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Day Completed</span>
            </div>
          )}

        </div>

      </div>

      {/* Task Filters (All / Pending / Completed, Category, Search) */}
      {tasks.length > 0 && (
        <TaskFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          selectedCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          counts={{
            all: tasks.length,
            pending: stats.pending,
            completed: stats.completed,
          }}
        />
      )}

      {/* Task Items List */}
      <div className="space-y-2.5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              disabled={isCompletedDay}
            />
          ))
        ) : tasks.length === 0 ? (
          /* Empty state when no tasks are added */
          <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mb-3.5 shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No tasks added yet for this day
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
              Maintain consistency! Break your goals into small actionable steps and start tracking your daily progress above.
            </p>
          </div>
        ) : (
          /* Empty state when filters yield no matches */
          <div className="text-center py-8 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            No tasks match your current filter criteria. Try resetting filters.
          </div>
        )}
      </div>

    </div>
  );
};

