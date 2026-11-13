import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  CalendarCheck,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { DayRecord, DayStats, Task } from '../types';
import { DailyDonutChart } from './DailyDonutChart';
import { DailyBarChart } from './DailyBarChart';
import { WeeklyProgressChart } from './WeeklyProgressChart';
import { MonthlyStats } from './MonthlyStats';

interface ChartsSectionProps {
  stats: DayStats;
  tasks: Task[];
  allDays: Record<string, DayRecord>;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  stats,
  tasks,
  allDays,
  selectedDate,
  onSelectDate,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');

  return (
    <section className="space-y-4">
      
      {/* Section Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Progress & Analytics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive data visualizations powered by your real activity
            </p>
          </div>
        </div>

        {/* View switcher tabs */}
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700/60 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Charts
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'daily'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Daily Charts
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'weekly'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            7-Day Consistency
          </button>

          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Summary
          </button>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="space-y-5">
        
        {/* Daily Charts Row: Donut Chart + Bar Chart */}
        {(activeTab === 'all' || activeTab === 'daily') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in">
            <DailyDonutChart stats={stats} />
            <DailyBarChart stats={stats} tasks={tasks} />
          </div>
        )}

        {/* Weekly & Monthly Charts Row */}
        {(activeTab === 'all' || activeTab === 'weekly' || activeTab === 'monthly') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in">
            {(activeTab === 'all' || activeTab === 'weekly') && (
              <div className={activeTab === 'weekly' ? 'lg:col-span-2' : ''}>
                <WeeklyProgressChart
                  allDays={allDays}
                  selectedDate={selectedDate}
                  onSelectDate={onSelectDate}
                />
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'monthly') && (
              <div className={activeTab === 'monthly' ? 'lg:col-span-2' : ''}>
                <MonthlyStats
                  allDays={allDays}
                  currentMonthDate={new Date()}
                />
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};

