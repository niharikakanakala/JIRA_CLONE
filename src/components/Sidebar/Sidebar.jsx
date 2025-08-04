import React from 'react';
import { ProjectOutlined, UnorderedListOutlined, BarChartOutlined } from '@ant-design/icons';

const Sidebar = ({ currentView, screenSize, onViewChange }) => {
  const sidebarStyle = {
    background: 'white',
    borderRight: '1px solid #f0f0f0',
    width: '100%', // Take full width of the sider
    padding: '16px 0',
    flexShrink: 0,
    height: '100%',
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column'
  };

  const navigationItems = [
    {
      key: 'board',
      icon: ProjectOutlined,
      label: 'Board',
    },
    {
      key: 'backlog',
      icon: UnorderedListOutlined,
      label: 'Backlog',
    },
    {
      key: 'reports',
      icon: BarChartOutlined,
      label: 'Reports',
    }
  ];

  const handleItemClick = (key) => {
    onViewChange(key);
  };

  return (
    <aside 
      id="app-sidebar"
      className="jira-sidebar"
      style={sidebarStyle}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '0 6px'
      }}>
        {navigationItems.map(item => {
          const IconComponent = item.icon;
          const isActive = currentView === item.key;
          
          return (
            <div
              key={item.key}
              id={`sidebar-${item.key}-btn`}
              onClick={() => handleItemClick(item.key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px 6px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: isActive ? '#e6f7ff' : 'transparent',
                color: isActive ? '#1890ff' : '#666',
                minHeight: '56px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <IconComponent 
                style={{ 
                  fontSize: '18px',
                  marginBottom: '3px'
                }} 
              />
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? '500' : '400',
                textAlign: 'center',
                lineHeight: '1.1'
              }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;