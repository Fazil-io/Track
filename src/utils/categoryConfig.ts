import { TaskCategory } from '../types';

export interface CategoryInfo {
  name: TaskCategory;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  iconName: string;
}

export const CATEGORY_MAP: Record<TaskCategory, CategoryInfo> = {
  'Learning': {
    name: 'Learning',
    color: '#3b82f6', // blue
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    badgeText: 'text-blue-600 dark:text-blue-400',
    badgeBorder: 'border-blue-500/20 dark:border-blue-500/30',
    dotColor: 'bg-blue-500',
    iconName: 'BookOpen',
  },
  'Coding / DSA': {
    name: 'Coding / DSA',
    color: '#8b5cf6', // purple
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    badgeText: 'text-purple-600 dark:text-purple-400',
    badgeBorder: 'border-purple-500/20 dark:border-purple-500/30',
    dotColor: 'bg-purple-500',
    iconName: 'Code2',
  },
  'Projects': {
    name: 'Projects',
    color: '#06b6d4', // cyan
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
    badgeBorder: 'border-cyan-500/20 dark:border-cyan-500/30',
    dotColor: 'bg-cyan-500',
    iconName: 'FolderGit2',
  },
  'College': {
    name: 'College',
    color: '#f59e0b', // amber
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    badgeText: 'text-amber-600 dark:text-amber-400',
    badgeBorder: 'border-amber-500/20 dark:border-amber-500/30',
    dotColor: 'bg-amber-500',
    iconName: 'GraduationCap',
  },
  'Personal': {
    name: 'Personal',
    color: '#ec4899', // pink
    badgeBg: 'bg-pink-500/10 dark:bg-pink-500/15',
    badgeText: 'text-pink-600 dark:text-pink-400',
    badgeBorder: 'border-pink-500/20 dark:border-pink-500/30',
    dotColor: 'bg-pink-500',
    iconName: 'User',
  },
  'Fitness': {
    name: 'Fitness',
    color: '#10b981', // emerald
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    badgeBorder: 'border-emerald-500/20 dark:border-emerald-500/30',
    dotColor: 'bg-emerald-500',
    iconName: 'Activity',
  },
  'Others': {
    name: 'Others',
    color: '#64748b', // slate
    badgeBg: 'bg-slate-500/10 dark:bg-slate-500/15',
    badgeText: 'text-slate-600 dark:text-slate-400',
    badgeBorder: 'border-slate-500/20 dark:border-slate-500/30',
    dotColor: 'bg-slate-500',
    iconName: 'Tag',
  },
};

export const ALL_CATEGORIES: TaskCategory[] = [
  'Learning',
  'Coding / DSA',
  'Projects',
  'College',
  'Personal',
  'Fitness',
  'Others',
];

