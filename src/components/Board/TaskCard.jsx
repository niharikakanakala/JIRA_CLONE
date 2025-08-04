import React, { useState } from 'react';
import { Button, Tag, Avatar, Typography, Space, Progress } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { TYPE_ICONS } from '../../utils/constants';

const { Text, Paragraph } = Typography;

const TaskCard = ({ task, onEdit, onDelete, screenSize, taskIndex, columnStatus }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    if (screenSize === 'mobile') return '12px';
    if (screenSize === 'tablet') return '14px';
    return '16px';
  };

  const getCardMargin = () => {
    if (screenSize === 'mobile') return '0 0 8px 0';
    return '0 0 12px 0';
  };

  const getTitleFontSize = () => {
    if (screenSize === 'mobile') return '13px';
    if (screenSize === 'tablet') return '14px';
    return '15px';
  };

  const getDescriptionFontSize = () => {
    if (screenSize === 'mobile') return '11px';
    if (screenSize === 'tablet') return '12px';
    return '13px';
  };

  const getIconSize = () => {
    if (screenSize === 'mobile') return 16;
    if (screenSize === 'tablet') return 18;
    return 20;
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high': 
        return { 
          color: 'red', 
          emoji: '🔥',
          gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
          borderColor: '#ff4757'
        };
      case 'medium': 
        return { 
          color: 'orange', 
          emoji: '⚡',
          gradient: 'linear-gradient(135deg, #ffa726, #ff9800)',
          borderColor: '#ff9800'
        };
      case 'low': 
        return { 
          color: 'green', 
          emoji: '🌱',
          gradient: 'linear-gradient(135deg, #66bb6a, #4caf50)',
          borderColor: '#4caf50'
        };
      default: 
        return { 
          color: 'default', 
          emoji: '📝',
          gradient: 'linear-gradient(135deg, #78909c, #607d8b)',
          borderColor: '#78909c'
        };
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case 'story': 
        return { 
          color: '#00d2d3', 
          bgGradient: 'linear-gradient(135deg, #00d2d3, #00bcd4)',
          emoji: '📚'
        };
      case 'bug': 
        return { 
          color: '#ff5722', 
          bgGradient: 'linear-gradient(135deg, #ff5722, #f44336)',
          emoji: '🐛'
        };
      case 'task': 
        return { 
          color: '#2196f3', 
          bgGradient: 'linear-gradient(135deg, #2196f3, #1976d2)',
          emoji: '✅'
        };
      case 'feature': 
        return { 
          color: '#9c27b0', 
          bgGradient: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
          emoji: '⭐'
        };
      default: 
        return { 
          color: '#2196f3', 
          bgGradient: 'linear-gradient(135deg, #2196f3, #1976d2)',
          emoji: '📝'
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const typeConfig = getTypeConfig(task.type);

  const getPriorityText = (priority) => {
    if (screenSize === 'mobile') {
      return priorityConfig.emoji;
    }
    return `${priorityConfig.emoji} ${priority.toUpperCase()}`;
  };

  // Simulate task progress based on status
  const getTaskProgress = () => {
    switch (task.status) {
      case 'todo': return 0;
      case 'progress': return 50;
      case 'review': return 80;
      case 'done': return 100;
      default: return 0;
    }
  };

  const getProgressColor = () => {
    const progress = getTaskProgress();
    if (progress === 0) return '#f0f0f0';
    if (progress <= 30) return '#ff4d4f';
    if (progress <= 70) return '#faad14';
    return '#52c41a';
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
        background: isHovered 
          ? 'linear-gradient(135deg, #ffffff, #f8fafc)' 
          : 'white',
        borderTopWidth: '3px',
        borderTopStyle: 'solid',
        borderTopColor: typeConfig.color,
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        borderRightColor: isHovered ? typeConfig.color : '#e1e4e9',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: isHovered ? typeConfig.color : '#e1e4e9',
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
        borderLeftColor: priorityConfig.borderColor,
        borderRadius: '12px',
        boxShadow: isHovered 
          ? `0 8px 25px rgba(0,0,0,0.15), 0 0 0 1px ${typeConfig.color}20`
          : isDragging 
          ? '0 10px 30px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.08)',
        padding: getCardPadding(),
        margin: getCardMargin(),
        cursor: 'grab',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isDragging ? 0.7 : 1,
        transform: isDragging 
          ? 'rotate(5deg) scale(1.05)' 
          : isHovered 
          ? 'translateY(-2px) scale(1.02)' 
          : 'none',
        minHeight: screenSize === 'mobile' ? '90px' : '110px',
        overflow: 'hidden'
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => {
        setShowMenu(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setShowMenu(false);
        setIsHovered(false);
      }}
    >
      {/* Animated background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60px',
        height: '60px',
        background: `${typeConfig.bgGradient}`,
        borderRadius: '0 12px 0 60px',
        opacity: 0.1,
        transition: 'opacity 0.3s ease'
      }} />

      {/* Progress indicator */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: '#f0f0f0',
        borderRadius: '0 0 12px 12px'
      }}>
        <div style={{
          height: '100%',
          background: getProgressColor(),
          width: `${getTaskProgress()}%`,
          transition: 'width 0.5s ease',
          borderRadius: '0 0 12px 12px'
        }} />
      </div>

      {/* Action Menu */}
      {showMenu && screenSize !== 'mobile' && (
        <div 
          id={`task-actions-${task.id}`}
          className="jira-task-actions"
          data-testid={`task-actions-${task.id}`}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 10,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '4px',
            transform: showMenu ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.8)',
            opacity: showMenu ? 1 : 0,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <Space size={4}>
            <Button
              id={`edit-task-btn-${task.id}`}
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={handleEditClick}
              title="Edit task"
              style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 8px rgba(79, 172, 254, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <Button
              id={`delete-task-btn-${task.id}`}
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleDeleteClick}
              title="Delete task"
              style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 8px rgba(255, 107, 107, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Space>
        </div>
      )}
      
      {/* Task Header */}
      <div 
        id={`task-header-${task.id}`}
        className="jira-task-header"
        data-testid={`task-header-${task.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: screenSize === 'mobile' ? '8px' : '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: typeConfig.bgGradient,
            borderRadius: '8px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconComponent 
              size={getIconSize() - 4} 
              style={{ color: 'white' }} 
            />
          </div>
          <Tag 
            style={{
              background: priorityConfig.gradient,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: screenSize === 'mobile' ? '10px' : '11px',
              padding: '2px 8px'
            }}
          >
            {getPriorityText(task.priority)}
          </Tag>
        </div>
        
        {screenSize === 'mobile' && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={handleEditClick}
              style={{
                width: '20px',
                height: '20px',
                fontSize: '10px',
                color: '#4facfe',
                padding: 0,
                minWidth: 'auto'
              }}
            />
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleDeleteClick}
              style={{
                width: '20px',
                height: '20px',
                fontSize: '10px',
                color: '#ff6b6b',
                padding: 0,
                minWidth: 'auto'
              }}
            />
          </div>
        )}
      </div>
      
      {/* Task Title */}
      <Text 
        id={`task-title-${task.id}`}
        strong
        style={{
          display: 'block',
          fontSize: getTitleFontSize(),
          color: '#1a202c',
          lineHeight: 1.4,
          marginBottom: screenSize === 'mobile' ? '6px' : '8px',
          wordWrap: 'break-word',
          background: 'linear-gradient(135deg, #1a202c, #2d3748)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        {task.title}
      </Text>
      
      {/* Task Description */}
      {screenSize !== 'mobile' && task.description && (
        <Paragraph 
          ellipsis={{ 
            rows: screenSize === 'tablet' ? 1 : 2, 
            expandable: false 
          }}
          style={{
            color: '#4a5568',
            marginBottom: '12px',
            fontSize: getDescriptionFontSize(),
            lineHeight: 1.5
          }}
        >
          {task.description}
        </Paragraph>
      )}
      
      {/* Task Footer */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ClockCircleOutlined style={{ color: '#a0aec0', fontSize: '12px' }} />
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {task.status === 'done' ? 'Completed' : 'In Progress'}
          </Text>
        </div>
        
        <Avatar 
          size={screenSize === 'mobile' ? 24 : 28}
          icon={<UserOutlined />}
          style={{
            background: typeConfig.bgGradient,
            color: 'white',
            fontSize: screenSize === 'mobile' ? '10px' : '12px',
            fontWeight: '600',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          title={task.assignee || 'Unassigned'}
        >
          {task.assignee ? task.assignee.charAt(0).toUpperCase() : '?'}
        </Avatar>
      </div>
    </div>
  );
};

export default TaskCard;