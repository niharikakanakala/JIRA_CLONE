import React from 'react';
import { Button, Badge, Dropdown, Empty, Typography, Space, Tag } from 'antd';
import { BellOutlined, CloseOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const NotificationsDropdown = ({ notifications, onClose, onClearAll, isOpen, onToggle }) => {
  const getTagColor = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'processing';
    }
  };

  const dropdownContent = (
    <div 
      id="notifications-dropdown"
      style={{
        width: '320px',
        maxHeight: '400px',
        backgroundColor: 'white',
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Title level={5} style={{ margin: 0, color: '#262626' }}>
          Notifications
        </Title>
        {notifications.length > 0 && (
          <Button
            id="clear-all-notifications-btn"
            type="text"
            size="small"
            onClick={onClearAll}
            style={{
              fontSize: '12px',
              color: '#666',
              padding: '2px 8px'
            }}
          >
            Clear All
          </Button>
        )}
      </div>
      
      {/* Content */}
      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <Empty 
              image={<BellOutlined style={{ fontSize: '32px', color: '#d9d9d9' }} />}
              description={
                <Text type="secondary">No notifications</Text>
              }
            />
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              id={`notification-item-${notification.id}`}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f5f5f5',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#fafafa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, marginRight: '8px' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <Tag 
                      color={getTagColor(notification.type)} 
                      size="small"
                      style={{ fontSize: '10px' }}
                    >
                      {notification.type.toUpperCase()}
                    </Tag>
                  </div>
                  <Text style={{ fontSize: '14px', color: '#262626', display: 'block', marginBottom: '4px' }}>
                    {notification.message}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </Text>
                </div>
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => onClose(notification.id)}
                  style={{
                    color: '#8c8c8c',
                    padding: '4px',
                    minWidth: 'auto',
                    width: '24px',
                    height: '24px'
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      overlay={dropdownContent}
      trigger={['click']}
      open={isOpen}
      onOpenChange={onToggle}
      placement="bottomRight"
    >
      <Button
        id="notifications-btn"
        type="text"
        shape="circle"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px'
        }}
        title={notifications.length > 0 ? `${notifications.length} notifications` : "No notifications"}
      >
        <Badge count={notifications.length} size="small">
          <BellOutlined style={{ fontSize: '20px', color: '#595959' }} />
        </Badge>
      </Button>
    </Dropdown>
  );
};

export default NotificationsDropdown;