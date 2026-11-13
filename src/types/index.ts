export type TaskCategory =
  | 'Learning'
  | 'Coding / DSA'
  | 'Projects'
  | 'College'
  | 'Personal'
  | 'Fitness'
  | 'Others';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority?: TaskPriority;
  completed: boolean;
  createdAt: string; // ISO string
  completedAt?: string;
}

export interface DayRecord {
  date: string; // 'YYYY-MM-DD'
  tasks: Task[];
  isCompletedDay: boolean;
  completedAt?: string;
  notes?: string;
}

export interface DayStats {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
}

export interface UserSettings {
  userName: string;
  userGoal: string;
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  enableConfetti: boolean;
}

export interface Quote {
  id: number;
  text: string;
  author: string;
  category?: string;
}

