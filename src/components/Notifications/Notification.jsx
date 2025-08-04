import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const getBgColor = () => {
    switch (notification.type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div 
      id={`notification-${notification.id}`}
      className={`${getBgColor()} text-white p-3 rounded-lg shadow-lg flex justify-between items-center mb-2 animate-slide-in max-w-sm`}
    >
      <span className="text-sm flex-1 mr-2">{notification.message}</span>
      <button
        onClick={() => onClose(notification.id)}
        className="ml-2 text-white hover:text-gray-200 flex-shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Notification;