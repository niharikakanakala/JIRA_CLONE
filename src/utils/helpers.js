export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getScreenSize = (width) => {
  if (width <= 499) return 'mobile';
  if (width <= 768) return 'tablet';
  return 'desktop';
};

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const sortTasksByDate = (tasks, field = 'updated', order = 'desc') => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a[field]);
    const dateB = new Date(b[field]);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};