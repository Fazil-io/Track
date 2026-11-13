import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Header 
} from './components/Header';
import { 
  OverviewCards 
} from './components/OverviewCards';
import { 
  TaskList 
} from './components/TaskList';
import { 
  ChartsSection 
} from './components/ChartsSection';
import { 
  CalendarView 
} from './components/CalendarView';
import { 
  EditTaskModal 
} from './components/EditTaskModal';
import { 
  CompleteDayModal 
} from './components/CompleteDayModal';
import { 
  ReportCard 
} from './components/ReportCard';
import { 
  SettingsModal 
} from './components/SettingsModal';
import { 
  ResetConfirmModal 
} from './components/ResetConfirmModal';

import { 
  Task, 
  TaskCategory, 
  DayRecord, 
  DayStats, 
  UserSettings 
} from './types';
import { 
  formatDateKey, 
  parseDateKey, 
  formatDisplayDate 
} from './utils/dateUtils';
import { 
  loadAllDays, 
  saveAllDays, 
  loadSettings, 
  saveSettings, 
  calculateDayStats, 
  clearAllData 
} from './utils/storage';
import { getQuoteForDate } from './utils/quotes';
import { soundManager } from './utils/audio';
import { calculateCurrentStreak } from './utils/streak';

export const App: React.FC = () => {
  // Current real today date
  const todayKey = useMemo(() => formatDateKey(new Date()), []);

  // Selected date being viewed/edited
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);

  // Storage states
  const [allDays, setAllDays] = useState<Record<string, DayRecord>>(() => loadAllDays());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());

  // Modal states
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCompleteDayOpen, setIsCompleteDayOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Active view tab on mobile/tablet (tasks, analytics, calendar)
  const [mobileTab, setMobileTab] = useState<'tasks' | 'analytics' | 'calendar'>('tasks');

  // Daily quote
  const quote = useMemo(() => getQuoteForDate(selectedDate), [selectedDate]);

  // Current day record
  const currentDayRecord: DayRecord = useMemo(() => {
    if (allDays[selectedDate]) {
      return allDays[selectedDate];
    }
    return {
      date: selectedDate,
      tasks: [],
      isCompletedDay: false,
    };
  }, [allDays, selectedDate]);

  // Current day stats
  const currentStats: DayStats = useMemo(() => {
    return calculateDayStats(currentDayRecord.tasks);
  }, [currentDayRecord.tasks]);

  // Current streak
  const streakCount = useMemo(() => {
    return calculateCurrentStreak(allDays, todayKey);
  }, [allDays, todayKey]);

  // Save changes to localStorage whenever allDays changes
  const updateAllDays = useCallback((newDays: Record<string, DayRecord>) => {
    setAllDays(newDays);
    saveAllDays(newDays);
  }, []);

  // Task actions
  const handleAddTask = (newTaskData: {
    title: string;
    description?: string;
    category: TaskCategory;
    priority?: any;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: newTaskData.title,
      description: newTaskData.description,
      category: newTaskData.category,
      priority: newTaskData.priority || 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...currentDayRecord.tasks];
    const updatedRecord: DayRecord = {
      ...currentDayRecord,
      tasks: updatedTasks,
    };

    updateAllDays({
      ...allDays,
      [selectedDate]: updatedRecord,
    });
  };

  const handleToggleTask = (taskId: string) => {
    if (currentDayRecord.isCompletedDay) return;

    let justCompleted = false;
    const updatedTasks = currentDayRecord.tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) justCompleted = true;
        return {
          ...t,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    const newStats = calculateDayStats(updatedTasks);

    // Audio effect
    if (settings.soundEnabled && justCompleted) {
      soundManager.playCheckSound();
    }

    // Confetti on 100% completion
    if (settings.enableConfetti && newStats.total > 0 && newStats.percentage === 100) {
      soundManager.playCelebrationSound();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    }

    const updatedRecord: DayRecord = {
      ...currentDayRecord,
      tasks: updatedTasks,
    };

    updateAllDays({
      ...allDays,
      [selectedDate]: updatedRecord,
    });
  };

  const handleEditTask = (task: Task) => {
    if (currentDayRecord.isCompletedDay) return;
    setEditingTask(task);
  };

  const handleSaveEditedTask = (updatedTask: Task) => {
    const updatedTasks = currentDayRecord.tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );

    const updatedRecord: DayRecord = {
      ...currentDayRecord,
      tasks: updatedTasks,
    };

    updateAllDays({
      ...allDays,
      [selectedDate]: updatedRecord,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (currentDayRecord.isCompletedDay) return;

    const updatedTasks = currentDayRecord.tasks.filter((t) => t.id !== taskId);
    const updatedRecord: DayRecord = {
      ...currentDayRecord,
      tasks: updatedTasks,
    };

    updateAllDays({
      ...allDays,
      [selectedDate]: updatedRecord,
    });
  };

  // Complete Day Action
  const handleConfirmCompleteDay = (notes?: string) => {
    const updatedRecord: DayRecord = {
      ...currentDayRecord,
      isCompletedDay: true,
      completedAt: new Date().toISOString(),
      notes: notes || currentDayRecord.notes,
    };

    updateAllDays({
      ...allDays,
      [selectedDate]: updatedRecord,
    });

    // Confetti celebration
    if (settings.enableConfetti) {
      soundManager.playCelebrationSound();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#10b981', '#6366f1', '#3b82f6', '#f59e0b', '#ec4899'],
      });
    }
  };

  // Unlock Day Action
  const handleUnlockDay = () => {
    const updatedRecord: DayRecord = {
      ...currentDayRecord,
      isCompletedDay: false,
    };

    updateAllDays({
      ...allDays,
      [selectedDate]: updatedRecord,
    });
  };

  // Start tracking a new day (e.g. today or next day)
  const handleStartNewDay = () => {
    setSelectedDate(todayKey);
  };

  // Save Settings
  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Reset All Data
  const handleConfirmReset = () => {
    clearAllData();
    const freshDays = {
      [todayKey]: {
        date: todayKey,
        tasks: [],
        isCompletedDay: false,
      },
    };
    setAllDays(freshDays);
    setSelectedDate(todayKey);
  };

  // Export Data JSON Backup
  const handleExportData = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      days: allDays,
      settings,
    };
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MyProgress_Backup_${todayKey}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import Data JSON Backup
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);
        if (parsed.days) {
          updateAllDays(parsed.days);
          if (parsed.settings) {
            handleSaveSettings(parsed.settings);
          }
          alert('Data backup imported successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        console.error('Import error:', err);
        alert('Failed to parse the backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#090d16] text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Header */}
      <Header
        selectedDate={selectedDate}
        todayDate={todayKey}
        quote={quote}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSelectToday={() => setSelectedDate(todayKey)}
        streakCount={streakCount}
        userName={settings.userName}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* User Motto Banner if set */}
        {settings.userGoal && (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300">
            <span className="font-semibold flex items-center gap-1.5">
              <span>🎯 Focus:</span>
              <span className="font-normal italic">"{settings.userGoal}"</span>
            </span>
            <span className="text-[11px] text-indigo-500 hidden sm:inline">
              Daily Consistency Dashboard
            </span>
          </div>
        )}

        {/* 1. Daily Overview Cards (4 cards with smooth animations) */}
        <OverviewCards
          stats={currentStats}
          isCompletedDay={currentDayRecord.isCompletedDay}
        />

        {/* Desktop Layout: Split view with Task Management on left (7 cols) and Calendar + Quick Stats on right (5 cols), then Analytics below */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Daily Task Management */}
          <div className="lg:col-span-7 space-y-6">
            <TaskList
              tasks={currentDayRecord.tasks}
              stats={currentStats}
              isCompletedDay={currentDayRecord.isCompletedDay}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onCompleteDay={() => setIsCompleteDayOpen(true)}
              onUnlockDay={handleUnlockDay}
              onOpenReport={() => setIsReportOpen(true)}
              onStartNewDay={handleStartNewDay}
              isToday={selectedDate === todayKey}
            />
          </div>

          {/* Right Column: Interactive Calendar & Day Navigation */}
          <div className="lg:col-span-5 space-y-6">
            <CalendarView
              allDays={allDays}
              selectedDate={selectedDate}
              onSelectDate={(newDate) => setSelectedDate(newDate)}
              todayDate={todayKey}
            />
          </div>

        </div>

        {/* 2. Dedicated Progress Visualization Section (Recharts Bar, Pie/Donut, 7-Day Consistency & Monthly stats) */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <ChartsSection
            stats={currentStats}
            tasks={currentDayRecord.tasks}
            allDays={allDays}
            selectedDate={selectedDate}
            onSelectDate={(newDate) => setSelectedDate(newDate)}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">My Progress</span>
            <span>•</span>
            <span>Daily Discipline & Growth Tracker</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Built for consistent achievers</span>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-indigo-500 transition"
            >
              Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEditedTask}
      />

      <CompleteDayModal
        isOpen={isCompleteDayOpen}
        onClose={() => setIsCompleteDayOpen(false)}
        onConfirm={handleConfirmCompleteDay}
        stats={currentStats}
        selectedDate={selectedDate}
      />

      <ReportCard
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        selectedDate={selectedDate}
        tasks={currentDayRecord.tasks}
        stats={currentStats}
        quote={quote}
        userName={settings.userName}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onRequestReset={() => setIsResetConfirmOpen(true)}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirmReset={handleConfirmReset}
      />

    </div>
  );
};

export default App;

