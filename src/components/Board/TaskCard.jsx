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

  // Better responsive sizing
  const getCardPadding = () => {
    if (screenSize === 'mobile') return '10px';
    if (screenSize === 'tablet') return '12px';
    return '14px';
  };

  const getCardMargin = () => {
    if (screenSize === 'mobile') return '0 0 6px 0';
    return '0 0 8px 0';
  };

  const getTitleFontSize = () => {
    if (screenSize === 'mobile') return '12px';
    if (screenSize === 'tablet') return '13px';
    return '14px';
  };

  const getDescriptionFontSize = () => {
    if (screenSize === 'mobile') return '10px';
    if (screenSize === 'tablet') return '11px';
    return '12px';
  };

  const getIconSize = () => {
    if (screenSize === 'mobile') return 14;
    if (screenSize === 'tablet') return 16;
    return 18;
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

  const getPriorityText = (priority) => {
    if (screenSize === 'mobile') {
      return priority.charAt(0).toUpperCase();
    }
    return priority.toUpperCase();
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
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: getCardPadding(),
        margin: getCardMargin(),
        cursor: 'grab',
        position: 'relative',
        transition: 'all 0.2s ease',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(2deg) scale(1.05)' : 'none',
        minHeight: screenSize === 'mobile' ? '80px' : '100px'
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {/* Action Menu - Better positioning */}
      {showMenu && screenSize !== 'mobile' && (
        <div 
          id={`task-actions-${task.id}`}
          className="jira-task-actions"
          data-testid={`task-actions-${task.id}`}
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
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
      
      {/* Task Header - Better layout */}
      <div 
        id={`task-header-${task.id}`}
        className="jira-task-header"
        data-testid={`task-header-${task.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 0,
          marginRight: 0,
          marginBottom: screenSize === 'mobile' ? '6px' : '8px',
          marginLeft: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IconComponent 
            size={getIconSize()} 
            style={{ color: '#6b7280', flexShrink: 0 }} 
          />
          <Tag color={getPriorityColor(task.priority)} size="small">
            {getPriorityText(task.priority)}
          </Tag>
        </div>
        {screenSize === 'mobile' && (
          <div style={{ display: 'flex', gap: '2px' }}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={handleEditClick}
              style={{
                width: '16px',
                height: '16px',
                fontSize: '10px',
                color: '#1890ff',
                padding: 0
              }}
            />
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleDeleteClick}
              style={{
                width: '16px',
                height: '16px',
                fontSize: '10px',
                color: '#ff4d4f',
                padding: 0
              }}
            />
          </div>
        )}
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
          marginTop: 0,
          marginRight: 0,
          marginBottom: screenSize === 'mobile' ? '4px' : '6px',
          marginLeft: 0,
          wordWrap: 'break-word'
        }}
      >
        {task.title}
      </Text>
      
      {/* Task Description - Better mobile handling */}
      {screenSize !== 'mobile' && (
        <Paragraph 
          id={`task-description-${task.id}`}
          className="jira-task-description"
          data-testid={`task-description-${task.id}`}
          ellipsis={{ 
            rows: screenSize === 'tablet' ? 1 : 2, 
            expandable: false 
          }}
          style={{
            color: '#6b778c',
            marginTop: 0,
            marginRight: 0,
            marginBottom: '8px',
            marginLeft: 0,
            fontSize: getDescriptionFontSize(),
            lineHeight: 1.4
          }}
        >
          {task.description}
        </Paragraph>
      )}
      
      {/* Task Footer - Simpler for mobile */}
      <div 
        id={`task-footer-${task.id}`}
        className="jira-task-footer"
        data-testid={`task-footer-${task.id}`}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 'auto',
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0
        }}
      >
        <Avatar 
          id={`task-assignee-${task.id}`}
          className="jira-assignee-avatar"
          data-testid={`task-assignee-${task.id}`}
          data-assignee={task.assignee}
          size={screenSize === 'mobile' ? 18 : 22}
          icon={<UserOutlined />}
          style={{
            backgroundColor: '#e6f7ff',
            color: '#1890ff',
            fontSize: screenSize === 'mobile' ? '9px' : '11px'
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