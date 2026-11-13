import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { DayRecord } from '../types';
import { getLast7DaysKeys, parseDateKey, formatDateKey } from '../utils/dateUtils';
import { calculateDayStats } from '../utils/storage';

interface WeeklyProgressChartProps {
  allDays: Record<string, DayRecord>;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({
  allDays,
  selectedDate,
  onSelectDate,
}) => {
  const dayKeys = getLast7DaysKeys(selectedDate);
  const dayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const data = dayKeys.map((key) => {
    const record = allDays[key];
    const stats = record ? calculateDayStats(record.tasks) : { total: 0, completed: 0, pending: 0, percentage: 0 };
    const dateObj = parseDateKey(key);
    const dayLabel = dayShortNames[dateObj.getDay()];
    const isSelected = key === selectedDate;

    return {
      dateKey: key,
      dayLabel: `${dayLabel} ${dateObj.getDate()}`,
      percentage: stats.percentage,
      total: stats.total,
      completed: stats.completed,
      isCompletedDay: record?.isCompletedDay || false,
      isSelected,
    };
  });

  const avgWeekly = Math.round(
    data.reduce((acc, curr) => acc + curr.percentage, 0) / (data.length || 1)
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[320px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              7-Day Consistency Trend
            </h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
              Avg: {avgWeekly}%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daily completion rate across the last 7 days
          </p>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Click any point to inspect day
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-56 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
            onClick={(state) => {
              if (state && state.activePayload && state.activePayload.length) {
                const clickedKey = state.activePayload[0].payload.dateKey;
                onSelectDate(clickedKey);
              }
            }}
          >
            <defs>
              <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis 
              dataKey="dayLabel" 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 0.5 }}
            />
            <YAxis 
              domain={[0, 100]} 
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              axisLine={false}
              tickLine={false}
              unit="%"
            />
            <ReferenceLine y={avgWeekly} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1.5} opacity={0.7} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-700 space-y-1">
                      <div className="font-bold text-indigo-300">{item.dayLabel} ({item.dateKey})</div>
                      <div className="flex items-center gap-2">
                        <span>Completion:</span>
                        <strong className="text-emerald-400 font-bold text-sm">{item.percentage}%</strong>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {item.completed} of {item.total} tasks completed
                      </div>
                      {item.isCompletedDay && (
                        <div className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">
                          ✓ Day Marked Completed
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800">
                        Click to view details
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#weeklyGradient)"
              dot={{ r: 4, stroke: '#6366f1', strokeWidth: 2, fill: '#ffffff' }}
              activeDot={{ r: 7, stroke: '#4f46e5', strokeWidth: 3, fill: '#6366f1' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Pill List */}
      <div className="grid grid-cols-7 gap-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {data.map((d) => (
          <button
            key={d.dateKey}
            type="button"
            onClick={() => onSelectDate(d.dateKey)}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl text-center transition ${
              d.isSelected
                ? 'bg-indigo-50 dark:bg-indigo-950/80 ring-2 ring-indigo-500 font-bold'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-[10px] text-slate-400">{d.dayLabel.split(' ')[0]}</span>
            <span className={`text-xs font-bold ${
              d.percentage >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
              d.percentage >= 50 ? 'text-indigo-600 dark:text-indigo-400' :
              d.percentage > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
            }`}>
              {d.percentage}%
            </span>
          </button>
        ))}
      </div>

    </div>
  );
};

