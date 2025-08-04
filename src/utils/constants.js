import { Book, Bug, CheckSquare } from 'lucide-react';

export const STATUS_COLUMNS = [
  { key: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { key: 'progress', title: 'In Progress', color: 'bg-blue-50' },
  { key: 'review', title: 'In Review', color: 'bg-yellow-50' },
  { key: 'done', title: 'Done', color: 'bg-green-50' }
];

export const PRIORITY_COLORS = {
  high: 'text-red-600 bg-red-100',
  medium: 'text-yellow-600 bg-yellow-100',
  low: 'text-green-600 bg-green-100'
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