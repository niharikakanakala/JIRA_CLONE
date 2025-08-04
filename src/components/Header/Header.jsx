import React from 'react';
import { Plus } from 'lucide-react';
import NotificationsDropdown from '../Notifications/NotificationsDropdown';

const Header = ({ 
  currentView, 
  screenSize, 
  notifications, 
  notificationsOpen,
  onCreateTask,
  onToggleNotifications,
  onRemoveNotification,
  onClearAllNotifications
}) => {
  const headerClasses = screenSize === 'mobile' 
    ? 'px-2 py-2' 
    : screenSize === 'tablet'
    ? 'px-4 py-3'
    : 'px-6 py-4';

  const titleClasses = screenSize === 'mobile' 
    ? 'text-lg font-bold' 
    : screenSize === 'tablet'
    ? 'text-xl font-bold'
    : 'text-2xl font-bold';

  return (
    <header 
      id="app-header"
      className={`bg-white border-b border-gray-200 flex items-center justify-between ${headerClasses} flex-shrink-0`}
    >
      <div className="flex items-center gap-4">
        <h1 id="app-title" className={`text-blue-600 ${titleClasses}`}>
          JIRA Clone
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>/</span>
          <span className="capitalize font-medium">{currentView}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationsDropdown
          notifications={notifications}
          onClose={onRemoveNotification}
          onClearAll={onClearAllNotifications}
          isOpen={notificationsOpen}
          onToggle={onToggleNotifications}
        />
        <button
          id="create-task-btn"
          onClick={onCreateTask}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors ${
            screenSize === 'mobile' ? 'text-sm px-3 py-1' : ''
          }`}
        >
          <Plus size={screenSize === 'mobile' ? 14 : 16} />
          {screenSize !== 'mobile' && 'Create'}
        </button>
      </div>
    </header>
  );
};

export default Header;