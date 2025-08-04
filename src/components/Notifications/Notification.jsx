import React, { useEffect } from 'react';
import { Alert, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const getNotificationType = () => {
    switch (notification.type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div 
      id={`notification-${notification.id}`}
      className="animate-slide-in"
      style={{
        maxWidth: '320px',
        marginBottom: '8px'
      }}
    >
      <Alert
        message={notification.message}
        type={getNotificationType()}
        showIcon
        closable
        onClose={() => onClose(notification.id)}
        closeIcon={<CloseOutlined style={{ fontSize: '12px' }} />}
        style={{
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          fontSize: '14px'
        }}
      />
    </div>
  );
};

export default Notification;