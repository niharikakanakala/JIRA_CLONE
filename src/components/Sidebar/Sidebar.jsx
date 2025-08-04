import React from 'react';
import { CheckSquare, Book, Bug } from 'lucide-react';

const Sidebar = ({ currentView, screenSize, onViewChange }) => {
  const sidebarClasses = screenSize === 'mobile' 
    ? 'w-16 p-1' 
    : screenSize === 'tablet'
    ? 'w-20 p-2'
    : 'w-24 p-3';

  const navigationItems = [
    {
      id: 'board',
      label: 'Board',
      icon: CheckSquare,
      view: 'board'
    },
    {
      id: 'backlog',
      label: 'Backlog',
      icon: Book,
      view: 'backlog'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: Bug,
      view: 'reports'
    }
  ];

  return (
    <aside 
      id="app-sidebar"
      className={`bg-white border-r border-gray-200 ${sidebarClasses} flex-shrink-0`}
    >
      <nav className="space-y-2">
        {navigationItems.map(item => (
          <button
            key={item.id}
            id={`sidebar-${item.id}-btn`}
            onClick={() => onViewChange(item.view)}
            className={`w-full p-2 text-left hover:bg-gray-100 rounded flex flex-col items-center gap-1 transition-colors ${
              currentView === item.view ? 'bg-blue-100 text-blue-600' : ''
            }`}
          >
            <item.icon size={screenSize === 'mobile' ? 16 : 20} />
            {screenSize !== 'mobile' && (
              <span className="text-xs">{item.label}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;