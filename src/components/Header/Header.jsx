import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
    ? 'jira-header' 
    : screenSize === 'tablet'
    ? 'jira-header'
    : 'jira-header';

  const titleClasses = screenSize === 'mobile' 
    ? 'text-lg font-bold' 
    : screenSize === 'tablet'
    ? 'text-xl font-bold'
    : 'text-2xl font-bold';

  return (
    <header 
      id="app-header"
      className={headerClasses}
      style={{
        background: 'white',
        borderBottom: '1px solid #f0f0f0',
        padding: screenSize === 'mobile' ? '0 8px' : '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        flexShrink: 0
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 
          id="app-title" 
          style={{ 
            color: '#1890ff', 
            fontSize: screenSize === 'mobile' ? '18px' : '24px',
            fontWeight: 'bold',
            margin: 0
          }}
        >
          JIRA Clone
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666' }}>
          <span>/</span>
          <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{currentView}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <NotificationsDropdown
          notifications={notifications}
          onClose={onRemoveNotification}
          onClearAll={onClearAllNotifications}
          isOpen={notificationsOpen}
          onToggle={onToggleNotifications}
        />
        <Button
          id="create-task-btn"
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateTask}
          size={screenSize === 'mobile' ? 'small' : 'middle'}
        >
          {screenSize !== 'mobile' && 'Create'}
        </Button>
      </div>
    </header>
  );
};

export default Header;