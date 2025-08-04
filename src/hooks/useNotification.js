import { useState, useCallback } from 'react';
import { generateId } from '../utils/helpers';
import { NOTIFICATION_TYPES } from '../utils/constants';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = NOTIFICATION_TYPES.SUCCESS) => {
    const id = generateId();
    setNotifications(prev => [...prev, { 
      id, 
      message, 
      type, 
      timestamp: Date.now() 
    }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
};