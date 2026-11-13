import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  CartesianGrid 
} from 'recharts';
import { DayStats, Task } from '../types';
import { CATEGORY_MAP } from '../utils/categoryConfig';

interface DailyBarChartProps {
  stats: DayStats;
  tasks: Task[];
}

export const DailyBarChart: React.FC<DailyBarChartProps> = ({ stats, tasks }) => {
  const [viewMode, setViewMode] = useState<'status' | 'category'>('status');

  // Status data
  const statusData = [
    { name: 'Completed', count: stats.completed, color: '#10b981' },
    { name: 'Pending', count: stats.pending, color: '#f59e0b' },
  ];

  // Category breakdown data
  const categoryCounts: Record<string, { total: number; completed: number; color: string }> = {};
  tasks.forEach((t) => {
    if (!categoryCounts[t.category]) {
      categoryCounts[t.category] = {
        total: 0,
        completed: 0,
        color: CATEGORY_MAP[t.category]?.color || '#6366f1',
      };
    }
    categoryCounts[t.category].total += 1;
    if (t.completed) categoryCounts[t.category].completed += 1;
  });

  const categoryData = Object.entries(categoryCounts).map(([cat, data]) => ({
    name: cat.length > 10 ? `${cat.slice(0, 8)}…` : cat,
    fullName: cat,
    completed: data.completed,
    pending: data.total - data.completed,
    total: data.total,
    color: data.color,
  }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[300px]">
      
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Daily Task Distribution
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {viewMode === 'status' ? 'Completed vs Pending status' : 'Tasks grouped by category'}
          </p>
        </div>

        {tasks.length > 0 && (
          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('status')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                viewMode === 'status'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Status
            </button>
            <button
              onClick={() => setViewMode('category')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                viewMode === 'category'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Category
            </button>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="w-full h-52 my-2">
        {stats.total === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
            Add tasks above to see the bar chart visualization
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'status' ? (
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#94a3b8' }} 
                  axisLine={{ stroke: '#cbd5e1', strokeWidth: 0.5 }}
                />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg border border-slate-700">
                          <span className="font-semibold">{item.name}:</span> {item.count} tasks
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={56}>
                  {statusData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#94a3b8' }} 
                  axisLine={{ stroke: '#cbd5e1', strokeWidth: 0.5 }}
                />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-700 space-y-1">
                          <div className="font-bold text-indigo-300">{item.fullName}</div>
                          <div>Total: {item.total}</div>
                          <div className="text-emerald-400">Completed: {item.completed}</div>
                          <div className="text-amber-400">Pending: {item.pending}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} maxBarSize={36} />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary Footer */}
      <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <span>Completion: <strong className="text-slate-800 dark:text-slate-200">{stats.percentage}%</strong></span>
        <span>Total: <strong className="text-slate-800 dark:text-slate-200">{stats.total} tasks</strong></span>
      </div>

    </div>
  );
};

