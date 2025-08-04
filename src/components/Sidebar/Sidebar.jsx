import React from 'react';
import { Menu } from 'antd';
import { ProjectOutlined, UnorderedListOutlined, BarChartOutlined } from '@ant-design/icons';

const Sidebar = ({ currentView, screenSize, onViewChange }) => {
  const sidebarStyle = {
    background: 'white',
    borderRight: '1px solid #f0f0f0',
    width: screenSize === 'mobile' ? '60px' : '200px',
    padding: screenSize === 'mobile' ? '8px 0' : '16px 0',
    flexShrink: 0,
    // Add these properties to ensure full height
    height: '100%',
    minHeight: 'calc(100vh - 64px)', // Account for header height
    display: 'flex',
    flexDirection: 'column'
  };

  const navigationItems = [
    {
      key: 'board',
      icon: <ProjectOutlined />,
      label: screenSize === 'mobile' ? '' : 'Board',
    },
    {
      key: 'backlog',
      icon: <UnorderedListOutlined />,
      label: screenSize === 'mobile' ? '' : 'Backlog',
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: screenSize === 'mobile' ? '' : 'Reports',
    }
  ];

  const handleMenuClick = ({ key }) => {
    onViewChange(key);
  };

  return (
    <aside 
      id="app-sidebar"
      className="jira-sidebar"
      style={sidebarStyle}
    >
      <Menu
        mode="vertical"
        selectedKeys={[currentView]}
        onClick={handleMenuClick}
        items={navigationItems}
        style={{
          border: 'none',
          background: 'transparent',
          flex: 1, // Take up available space
          height: '100%'
        }}
      />
    </aside>
  );
};

export default Sidebar;