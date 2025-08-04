import React, { useState } from 'react';
import { Badge, Typography, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TaskCard from './TaskCard';

const { Text, Title } = Typography;

const Column = ({ column, tasks, onEdit, onDelete, onMove, screenSize, columnIndex }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const dataString = e.dataTransfer.getData('application/json');
      if (!dataString) return;
      
      const data = JSON.parse(dataString);
      const { taskId, fromStatus } = data;
      
      if (fromStatus !== column.key) {
        onMove(taskId, column.key, fromStatus);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const getColumnHeight = () => {
    if (screenSize === 'mobile') return 'calc((100vh - 80px) / 2 - 8px)';
    return 'calc(100vh - 140px)';
  };

  const getPadding = () => {
    if (screenSize === 'mobile') return '12px';
    if (screenSize === 'tablet') return '16px';
    return '20px';
  };

  const getMinWidth = () => {
    if (screenSize === 'mobile') return '160px';
    if (screenSize === 'tablet') return '220px';
    return '280px';
  };

  const getColumnConfig = (columnKey) => {
    switch (columnKey) {
      case 'todo': 
        return { 
          bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          lightBg: '#f8faff',
          accentColor: '#667eea',
          emoji: '📋',
          hoverBg: 'linear-gradient(135deg, #667eea 10%, #764ba2 90%)'
        };
      case 'progress': 
        return { 
          bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          lightBg: '#fff8f9',
          accentColor: '#f093fb',
          emoji: '⚡',
          hoverBg: 'linear-gradient(135deg, #f093fb 10%, #f5576c 90%)'
        };
      case 'review': 
        return { 
          bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          lightBg: '#f7fdff',
          accentColor: '#4facfe',
          emoji: '👀',
          hoverBg: 'linear-gradient(135deg, #4facfe 10%, #00f2fe 90%)'
        };
      case 'done': 
        return { 
          bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          lightBg: '#f7fffc',
          accentColor: '#43e97b',
          emoji: '✅',
          hoverBg: 'linear-gradient(135deg, #43e97b 10%, #38f9d7 90%)'
        };
      default: 
        return { 
          bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          lightBg: '#f9fffe',
          accentColor: '#a8edea',
          emoji: '📝',
          hoverBg: 'linear-gradient(135deg, #a8edea 10%, #fed6e3 90%)'
        };
    }
  };

  const getColumnTitle = () => {
    if (screenSize === 'mobile') {
      switch (column.title) {
        case 'To Do': return 'To Do';
        case 'In Progress': return 'Progress';
        case 'In Review': return 'Review';
        case 'Done': return 'Done';
        default: return column.title;
      }
    }
    return column.title;
  };

  const columnConfig = getColumnConfig(column.key);

  return (
    <div 
      id={`column-${column.key}`}
      className={`jira-column jira-column-${column.key} ${column.color}`}
      data-testid={`column-${column.key}`}
      data-column-status={column.key}
      data-column-index={columnIndex}
      style={{
        background: isDragOver 
          ? `linear-gradient(135deg, ${columnConfig.accentColor}20, ${columnConfig.accentColor}10)`
          : isHovered 
          ? columnConfig.lightBg 
          : 'white',
        borderRadius: '16px',
        padding: getPadding(),
        display: 'flex',
        flexDirection: 'column',
        height: getColumnHeight(),
        minHeight: screenSize === 'mobile' ? '200px' : '320px',
        minWidth: getMinWidth(),
        border: isDragOver 
          ? `2px dashed ${columnConfig.accentColor}` 
          : `1px solid ${isHovered ? columnConfig.accentColor + '40' : '#e2e8f0'}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: isHovered 
          ? `0 8px 25px ${columnConfig.accentColor}20, 0 0 0 1px ${columnConfig.accentColor}30`
          : '0 2px 8px rgba(0,0,0,0.08)',
        transform: isHovered ? 'translateY(-2px)' : 'none'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated header background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: columnConfig.bg,
        borderRadius: '16px 16px 0 0',
        opacity: 0.1,
        transition: 'opacity 0.3s ease'
      }} />

      {/* Column Header */}
      <div 
        id={`column-header-${column.key}`}
        className="jira-column-header"
        data-testid={`column-header-${column.key}`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: screenSize === 'mobile' ? '12px' : '16px',
          flexShrink: 0,
          minHeight: '40px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: columnConfig.bg,
            borderRadius: '10px',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '32px',
            height: '32px'
          }}>
            <span style={{ fontSize: '16px' }}>{columnConfig.emoji}</span>
          </div>
          <Title 
            level={5}
            style={{
              fontWeight: '700',
              background: columnConfig.bg,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: screenSize === 'mobile' ? '13px' : screenSize === 'tablet' ? '14px' : '16px',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              lineHeight: '1.2'
            }}
          >
            {getColumnTitle()}
          </Title>
        </div>
        
        <Badge 
          count={tasks.length}
          style={{
            background: columnConfig.bg,
            color: 'white',
            fontWeight: '600',
            fontSize: '11px',
            minWidth: '24px',
            height: '24px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          size={screenSize === 'mobile' ? 'small' : 'default'}
        />
      </div>

      {/* Tasks Container */}
      <div 
        id={`column-tasks-${column.key}`}
        className="jira-column-content scrollable"
        data-testid={`column-tasks-${column.key}`}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
          paddingRight: '4px'
        }}
      >
        {tasks.map((task, taskIndex) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            screenSize={screenSize}
            taskIndex={taskIndex}
            columnStatus={column.key}
          />
        ))}
        
        {/* Enhanced Drop Zone */}
        {isDragOver && (
          <div 
            style={{
              border: `3px dashed ${columnConfig.accentColor}`,
              borderRadius: '12px',
              padding: screenSize === 'mobile' ? '16px' : '24px',
              textAlign: 'center',
              background: `linear-gradient(135deg, ${columnConfig.accentColor}10, ${columnConfig.accentColor}05)`,
              marginBottom: '12px',
              animation: 'pulse 2s infinite'
            }}
          >
            <div style={{
              background: columnConfig.bg,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px'
            }}>
              <PlusOutlined style={{ color: 'white', fontSize: '18px' }} />
            </div>
            <Text style={{ 
              color: columnConfig.accentColor, 
              fontSize: screenSize === 'mobile' ? '12px' : '14px',
              fontWeight: '600'
            }}>
              Drop task here
            </Text>
          </div>
        )}
        
        {/* Enhanced Empty State */}
        {tasks.length === 0 && !isDragOver && (
          <div 
            style={{
              textAlign: 'center',
              padding: screenSize === 'mobile' ? '20px 12px' : '32px 16px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${columnConfig.accentColor}08, ${columnConfig.accentColor}04)`,
              border: `1px dashed ${columnConfig.accentColor}30`
            }}
          >
            <div style={{
              background: columnConfig.bg,
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              opacity: 0.7
            }}>
              <span style={{ fontSize: '20px' }}>{columnConfig.emoji}</span>
            </div>
            <Text type="secondary" style={{ 
              fontSize: screenSize === 'mobile' ? '11px' : '13px',
              color: columnConfig.accentColor + '80'
            }}>
              No tasks yet
            </Text>
            <br />
            <Text type="secondary" style={{ 
              fontSize: screenSize === 'mobile' ? '10px' : '12px',
              color: columnConfig.accentColor + '60'
            }}>
              Drag tasks here
            </Text>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Column;