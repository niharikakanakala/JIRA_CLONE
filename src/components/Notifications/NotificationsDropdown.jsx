import React from 'react';
import { Bell, X } from 'lucide-react';

const NotificationsDropdown = ({ notifications, onClose, onClearAll, isOpen, onToggle }) => {
  return (
    <div className="relative">
      <button
        id="notifications-btn"
        onClick={onToggle}
        className="p-2 hover:bg-gray-100 rounded-full relative transition-colors"
        title={notifications.length > 0 ? `${notifications.length} notifications` : "No notifications"}
      >
        <Bell size={20} className="text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          id="notifications-dropdown"
          className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
        >
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {notifications.length > 0 && (
              <button
                id="clear-all-notifications-btn"
                onClick={onClearAll}
                className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="max-h-64 overflow-y-auto scrollable">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  id={`notification-item-${notification.id}`}
                  className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-1 ${
                        notification.type === 'success' ? 'bg-green-100 text-green-700' :
                        notification.type === 'error' ? 'bg-red-100 text-red-700' :
                        notification.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {notification.type.toUpperCase()}
                      </div>
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => onClose(notification.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;