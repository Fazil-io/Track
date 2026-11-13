import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { DayStats } from '../types';

interface DailyDonutChartProps {
  stats: DayStats;
}

export const DailyDonutChart: React.FC<DailyDonutChartProps> = ({ stats }) => {
  const hasTasks = stats.total > 0;

  const data = hasTasks
    ? [
        { name: 'Completed', value: stats.completed, color: '#10b981' },
        { name: 'Pending', value: stats.pending, color: '#f59e0b' },
      ]
    : [
        { name: 'No tasks', value: 1, color: '#94a3b8' }
      ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between min-h-[300px]">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Daily Progress Breakdown
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ratio of completed vs pending tasks
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          Pie Chart
        </span>
      </div>

      {/* Chart with Percentage in the Center */}
      <div className="relative w-full h-52 flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  return (
                    <div className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg border border-slate-700">
                      <span className="font-semibold">{item.name}:</span> {item.value} {item.value === 1 ? 'task' : 'tasks'}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={78}
              paddingAngle={hasTasks ? 4 : 0}
              dataKey="value"
              stroke="none"
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center overlay showing percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums">
            {hasTasks ? `${stats.percentage}%` : '0%'}
          </span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Completed
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full flex items-center justify-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Completed: <strong className="text-emerald-600 dark:text-emerald-400">{stats.completed}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Pending: <strong className="text-amber-600 dark:text-amber-400">{stats.pending}</strong>
          </span>
        </div>
      </div>

    </div>
  );
};

