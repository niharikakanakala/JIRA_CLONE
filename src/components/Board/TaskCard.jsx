import React, { useState } from 'react';
import { Button, Tag, Avatar, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { TYPE_ICONS } from '../../utils/constants';

const { Text, Paragraph } = Typography;

const TaskCard = ({ task, onEdit, onDelete, screenSize, taskIndex, columnStatus }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const IconComponent = TYPE_ICONS[task.type];

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('application/json', JSON.stringify({
      taskId: task.id,
      fromStatus: task.status
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Deleting task directly:', task.id);
    onDelete(task.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(task);
  };

  // Responsive sizing
  const getCardPadding = () => {
    if (screenSize === 'mobile') return '8px';
    if (screenSize === 'tablet') return '12px';
    return '12px';
  };

  const getCardMargin = () => {
    if (screenSize === 'mobile') return '4px';
    return '8px';
  };

  const getTitleFontSize = () => {
    if (screenSize === 'mobile') return '11px';
    if (screenSize === 'tablet') return '12px';
    return '13px';
  };

  const getDescriptionFontSize = () => {
    if (screenSize === 'mobile') return '9px';
    if (screenSize === 'tablet') return '10px';
    return '11px';
  };

  const getIconSize = () => {
    if (screenSize === 'mobile') return 12;
    if (screenSize === 'tablet') return 14;
    return 16;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'story': return '#36b37e';
      case 'bug': return '#ff5630';
      case 'task': return '#0052cc';
      case 'feature': return '#6554c0';
      default: return '#0052cc';
    }
  };

  return (
    <div 
      id={`task-card-${task.id}`}
      className={`jira-task-card jira-task-${task.type} jira-priority-${task.priority}`}
      data-testid={`task-card-${task.id}`}
      data-task-id={task.id}
      data-task-type={task.type}
      data-task-priority={task.priority}
      data-task-status={task.status}
      data-task-index={taskIndex}
      data-column-status={columnStatus}
      style={{
        backgroundColor: 'white',
        border: '1px solid #e1e4e9',
        borderTop: `2px solid ${getTypeColor(task.type)}`,
        borderLeft: `3px solid ${task.priority === 'high' ? '#c62828' : task.priority === 'medium' ? '#ef6c00' : '#2e7d32'}`,
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: getCardPadding(),
        marginBottom: getCardMargin(),
        cursor: 'grab',
        position: 'relative',
        transition: 'all 0.2s ease',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(2deg) scale(1.05)' : 'none'
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {/* Action Menu - Responsive positioning */}
      {showMenu && (
        <div 
          id={`task-actions-${task.id}`}
          className="jira-task-actions"
          data-testid={`task-actions-${task.id}`}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 10,
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '2px'
          }}
        >
          <Space size={2}>
            <Button
              id={`edit-task-btn-${task.id}`}
              className="jira-edit-btn"
              data-testid={`edit-task-btn-${task.id}`}
              data-action="edit"
              data-task-id={task.id}
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={handleEditClick}
              title="Edit task"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#e6f7ff',
                color: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
            <Button
              id={`delete-task-btn-${task.id}`}
              className="jira-delete-btn"
              data-testid={`delete-task-btn-${task.id}`}
              data-action="delete"
              data-task-id={task.id}
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleDeleteClick}
              title="Delete task"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#fff1f0',
                color: '#ff4d4f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </Space>
        </div>
      )}
      
      {/* Task Header - Compact layout */}
      <div 
        id={`task-header-${task.id}`}
        className="jira-task-header"
        data-testid={`task-header-${task.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: screenSize === 'mobile' ? '4px' : '6px',
          marginBottom: screenSize === 'mobile' ? '4px' : '6px'
        }}
      >
        <IconComponent 
          size={getIconSize()} 
          style={{ color: '#6b7280', flexShrink: 0 }} 
        />
        <Tag color={getPriorityColor(task.priority)} size="small">
          {screenSize === 'mobile' ? task.priority.charAt(0).toUpperCase() : task.priority.toUpperCase()}
        </Tag>
      </div>
      
      {/* Task Title */}
      <Text 
        id={`task-title-${task.id}`}
        className="jira-task-title"
        data-testid={`task-title-${task.id}`}
        strong
        style={{
          display: 'block',
          fontSize: getTitleFontSize(),
          color: '#172b4d',
          lineHeight: 1.3,
          marginBottom: screenSize === 'mobile' ? '4px' : '4px',
          wordWrap: 'break-word'
        }}
      >
        {task.title}
      </Text>
      
      {/* Task Description - Compact layout */}
      <Paragraph 
        id={`task-description-${task.id}`}
        className="jira-task-description"
        data-testid={`task-description-${task.id}`}
        ellipsis={{ 
          rows: screenSize === 'mobile' ? 1 : 2, 
          expandable: false 
        }}
        style={{
          color: '#6b778c',
          marginBottom: screenSize === 'mobile' ? '6px' : '8px',
          fontSize: getDescriptionFontSize(),
          lineHeight: 1.4,
          margin: 0
        }}
      >
        {task.description}
      </Paragraph>
      
      {/* Task Footer - Compact layout */}
      <div 
        id={`task-footer-${task.id}`}
        className="jira-task-footer"
        data-testid={`task-footer-${task.id}`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px'
        }}
      >
        <div></div>
        <Avatar 
          id={`task-assignee-${task.id}`}
          className="jira-assignee-avatar"
          data-testid={`task-assignee-${task.id}`}
          data-assignee={task.assignee}
          size={screenSize === 'mobile' ? 16 : 20}
          icon={<UserOutlined />}
          style={{
            backgroundColor: '#e6f7ff',
            color: '#1890ff',
            fontSize: screenSize === 'mobile' ? '8px' : '10px'
          }}
          title={task.assignee || 'Unassigned'}
        >
          {task.assignee ? task.assignee.charAt(0).toUpperCase() : null}
        </Avatar>
      </div>
    </div>
  );
};

export default TaskCard;