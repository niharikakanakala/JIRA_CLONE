import { Book, Bug, CheckSquare } from 'lucide-react';

export const STATUS_COLUMNS = [
  { key: 'todo', title: 'To Do', color: 'todo' },
  { key: 'progress', title: 'In Progress', color: 'progress' },
  { key: 'review', title: 'In Review', color: 'review' },
  { key: 'done', title: 'Done', color: 'done' }
];

export const PRIORITY_COLORS = {
  high: 'high',
  medium: 'medium',
  low: 'low'
};

export const TYPE_ICONS = {
  story: Book,
  bug: Bug,
  task: CheckSquare,
  feature: CheckSquare
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

export const BREAKPOINTS = {
  MOBILE: 499,
  TABLET: 768
};