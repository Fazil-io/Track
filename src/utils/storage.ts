import { DayRecord, DayStats, Task, UserSettings } from '../types';
import { formatDateKey } from './dateUtils';

const STORAGE_KEY_DAYS = 'my_progress_tracker_days_v1';
const STORAGE_KEY_SETTINGS = 'my_progress_tracker_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Productive Achiever',
  userGoal: 'Consistency is key. 1% better every day.',
  theme: 'system',
  soundEnabled: true,
  enableConfetti: true,
};

export function calculateDayStats(tasks: Task[]): DayStats {
  const total = tasks.length;
  if (total === 0) {
    return { total: 0, completed: 0, pending: 0, percentage: 0 };
  }
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = Math.round((completed / total) * 100);
  return { total, completed, pending, percentage };
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// Generate realistic initial starter data if storage is brand new
export function getInitialDays(): Record<string, DayRecord> {
  const today = new Date();
  const records: Record<string, DayRecord> = {};

  // Nov 14, 2026 or current today
  const todayKey = formatDateKey(today);

  // Past 5 days
  const pastDaysTemplates = [
    {
      offset: 5,
      isCompleted: true,
      tasks: [
        { title: 'LeetCode: 2 Medium Dynamic Programming problems', category: 'Coding / DSA', completed: true, priority: 'high' },
        { title: 'Fullstack project: Setup PostgreSQL schema', category: 'Projects', completed: true, priority: 'medium' },
        { title: 'Read System Design Chapter 3: Caching', category: 'Learning', completed: true, priority: 'medium' },
        { title: 'Morning 5km run & stretching', category: 'Fitness', completed: true, priority: 'low' },
      ]
    },
    {
      offset: 4,
      isCompleted: true,
      tasks: [
        { title: 'Revise Graph Algorithms (BFS/DFS/Dijkstra)', category: 'Coding / DSA', completed: true, priority: 'high' },
        { title: 'Submit Operating Systems Assignment 2', category: 'College', completed: true, priority: 'high' },
        { title: 'Build React UI component library modal', category: 'Projects', completed: true, priority: 'medium' },
        { title: 'Read 20 pages of Atomic Habits', category: 'Personal', completed: true, priority: 'low' },
        { title: '30 mins HIIT workout', category: 'Fitness', completed: true, priority: 'low' },
      ]
    },
    {
      offset: 3,
      isCompleted: true,
      tasks: [
        { title: 'Binary Search Tree traversal questions', category: 'Coding / DSA', completed: true, priority: 'medium' },
        { title: 'Database Indexing & B-Trees deep dive', category: 'Learning', completed: true, priority: 'high' },
        { title: 'Push code changes to GitHub repository', category: 'Projects', completed: true, priority: 'medium' },
        { title: 'Review lecture notes on Computer Networks', category: 'College', completed: false, priority: 'medium' },
      ]
    },
    {
      offset: 2,
      isCompleted: true,
      tasks: [
        { title: 'Solve 3 Greedy algorithms on Codeforces', category: 'Coding / DSA', completed: true, priority: 'high' },
        { title: 'Deploy frontend staging build to Vercel', category: 'Projects', completed: true, priority: 'medium' },
        { title: 'Organize project board & backlog', category: 'Personal', completed: true, priority: 'low' },
        { title: 'Attend Advanced Algorithms seminar', category: 'College', completed: true, priority: 'medium' },
        { title: 'Evening gym: Chest & Triceps workout', category: 'Fitness', completed: true, priority: 'medium' },
      ]
    },
    {
      offset: 1,
      isCompleted: true,
      tasks: [
        { title: 'Mock Technical Interview practice (Binary Trees)', category: 'Coding / DSA', completed: true, priority: 'high' },
        { title: 'Implement JWT authentication on backend API', category: 'Projects', completed: true, priority: 'high' },
        { title: 'Read articles on Web Vitals optimization', category: 'Learning', completed: true, priority: 'low' },
        { title: 'Prepare presentation slides for College project', category: 'College', completed: true, priority: 'medium' },
        { title: 'Meditation & mobility routine (20 min)', category: 'Fitness', completed: true, priority: 'low' },
      ]
    }
  ];

  pastDaysTemplates.forEach(t => {
    const d = new Date(today);
    d.setDate(today.getDate() - t.offset);
    const dateKey = formatDateKey(d);
    const dayTasks: Task[] = t.tasks.map((task, idx) => ({
      id: `seed-${dateKey}-${idx}`,
      title: task.title,
      category: task.category as any,
      priority: task.priority as any,
      completed: task.completed,
      createdAt: d.toISOString(),
      completedAt: task.completed ? d.toISOString() : undefined,
    }));

    records[dateKey] = {
      date: dateKey,
      tasks: dayTasks,
      isCompletedDay: t.isCompleted,
      completedAt: d.toISOString(),
      notes: 'Great productive session!'
    };
  });

  // Today's fresh tasks ready for user
  const todayTasks: Task[] = [
    {
      id: `task-${todayKey}-1`,
      title: 'Review and solve 2 Two-Pointer LeetCode problems',
      description: 'Focus on 3Sum and Container With Most Water edge cases',
      category: 'Coding / DSA',
      priority: 'high',
      completed: true,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
    {
      id: `task-${todayKey}-2`,
      title: 'Design high-converting landing page prototype',
      description: 'Implement responsive glassmorphic cards and micro-animations',
      category: 'Projects',
      priority: 'high',
      completed: true,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
    {
      id: `task-${todayKey}-3`,
      title: 'Study Distributed Systems: Raft consensus algorithm',
      description: 'Take notes on leader election and log replication',
      category: 'Learning',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: `task-${todayKey}-4`,
      title: 'College Lab report writeup & submission',
      description: 'Complete analysis on network packet capture experiment',
      category: 'College',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: `task-${todayKey}-5`,
      title: 'Workout: 45-minute strength training & stretching',
      description: 'Keep proper posture and hydrate well',
      category: 'Fitness',
      priority: 'low',
      completed: false,
      createdAt: new Date().toISOString(),
    }
  ];

  records[todayKey] = {
    date: todayKey,
    tasks: todayTasks,
    isCompletedDay: false,
  };

  return records;
}

export function loadAllDays(): Record<string, DayRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DAYS);
    if (!raw) {
      const initial = getInitialDays();
      saveAllDays(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load days from storage:', e);
    const initial = getInitialDays();
    return initial;
  }
}

export function saveAllDays(days: Record<string, DayRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(days));
  } catch (e) {
    console.error('Failed to save days to storage:', e);
  }
}

export function getDayRecord(dateKey: string): DayRecord {
  const all = loadAllDays();
  if (all[dateKey]) {
    return all[dateKey];
  }
  return {
    date: dateKey,
    tasks: [],
    isCompletedDay: false,
  };
}

export function saveDayRecord(record: DayRecord): void {
  const all = loadAllDays();
  all[record.date] = record;
  saveAllDays(all);
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY_DAYS);
  localStorage.removeItem(STORAGE_KEY_SETTINGS);
}

