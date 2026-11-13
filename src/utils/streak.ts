import { DayRecord } from '../types';
import { formatDateKey, parseDateKey } from './dateUtils';
import { calculateDayStats } from './storage';

export function calculateCurrentStreak(allDays: Record<string, DayRecord>, todayKey: string): number {
  let streak = 0;
  const today = parseDateKey(todayKey);

  // Check today first
  const todayRecord = allDays[todayKey];
  const todayStats = todayRecord ? calculateDayStats(todayRecord.tasks) : null;
  const todayHasActivity = todayRecord && (todayRecord.isCompletedDay || (todayStats && todayStats.completed > 0));

  if (todayHasActivity) {
    streak += 1;
  }

  // Iterate backwards day by day from yesterday
  for (let i = 1; i <= 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);
    const record = allDays[key];

    if (!record) {
      break;
    }

    const stats = calculateDayStats(record.tasks);
    // If the day was marked completed or had at least 1 completed task
    if (record.isCompletedDay || stats.completed > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

