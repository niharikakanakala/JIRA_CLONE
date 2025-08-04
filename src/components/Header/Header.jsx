import React from 'react';
import { Button, Breadcrumb } from 'antd';
import { PlusOutlined, RocketOutlined } from '@ant-design/icons';
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
  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderBottom: 'none',
    padding: screenSize === 'mobile' ? '0 12px' : '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    overflow: 'hidden'
  };

  const getViewEmoji = (view) => {
    switch (view) {
      case 'board': return '📋';
      case 'backlog': return '📚';
      case 'reports': return '📊';
      default: return '📋';
    }
  };

  const getViewDisplayName = (view) => {
    switch (view) {
      case 'board': return 'Board';
      case 'backlog': return 'Backlog';
      case 'reports': return 'Reports';
      default: return view;
    }
  };

  return (
    <header 
      id="app-header"
      style={headerStyle}
    >
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '200px',
        height: '200px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-5%',
        width: '150px',
        height: '150px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '8px',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RocketOutlined style={{ 
              color: 'white', 
              fontSize: screenSize === 'mobile' ? '18px' : '22px' 
            }} />
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: screenSize === 'mobile' ? '18px' : '24px',
            fontWeight: '800',
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '0.5px'
          }}>
            JIRA Clone
          </h1>
        </div>
        
        {screenSize === 'mobile' ? (
          <div style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255,255,255,0.1)',
            padding: '4px 8px',
            borderRadius: '6px',
            backdropFilter: 'blur(10px)'
          }}>
            <span>{getViewEmoji(currentView)}</span>
            <span>{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</span>
          </div>
        ) : (
          <Breadcrumb
            separator="/"
            style={{ color: 'rgba(255,255,255,0.8)' }}
            items={[
              {
                title: (
                  <span style={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    Project
                  </span>
                )
              },
              {
                title: (
                  <span style={{ 
                    color: 'white', 
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>{getViewEmoji(currentView)}</span>
                    {getViewDisplayName(currentView)}
                  </span>
                )
              }
            ]}
          />
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: screenSize === 'mobile' ? '8px' : '16px',
        zIndex: 1
      }}>
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
          size={screenSize === 'mobile' ? 'middle' : 'large'}
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            height: screenSize === 'mobile' ? '36px' : '40px',
            boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = '0 6px 16px rgba(79, 172, 254, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(79, 172, 254, 0.4)';
          }}
        >
          <span style={{ fontSize: screenSize === 'mobile' ? '12px' : '14px' }}>
            {screenSize === 'mobile' ? 'Create' : 'Create Task'}
          </span>
        </Button>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </header>
  );
};

export default Header;