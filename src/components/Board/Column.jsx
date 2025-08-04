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

  // Better responsive dimensions
  const getColumnHeight = () => {
    if (screenSize === 'mobile') return 'calc(50vh - 90px)'; // Half screen height for 2x2 grid
    if (screenSize === 'tablet') return 'calc(50vh - 100px)'; // Account for 2x2 grid
    return 'calc(100vh - 180px)'; // Desktop full height
  };

  const getPadding = () => {
    if (screenSize === 'mobile') return '8px';
    if (screenSize === 'tablet') return '12px';
    return '16px';
  };

  const getMinWidth = () => {
    return '100%'; // Always take full available width
  };

  const getMaxHeight = () => {
    if (screenSize === 'mobile') return 'calc(50vh - 90px)';
    if (screenSize === 'tablet') return 'calc(50vh - 100px)';
    return 'none';
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
        maxHeight: getMaxHeight(),
        minHeight: screenSize === 'mobile' ? '150px' : '250px',
        minWidth: getMinWidth(),
        width: '100%',
        border: isDragOver 
          ? `2px dashed ${columnConfig.accentColor}` 
          : `1px solid ${isHovered ? columnConfig.accentColor + '40' : '#e2e8f0'}`,
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: isHovered 
          ? `0 12px 35px ${columnConfig.accentColor}25, 0 0 0 1px ${columnConfig.accentColor}40`
          : '0 2px 8px rgba(0,0,0,0.08)',
        transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        marginBottom: '0' // No margin needed in grid layout
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
        opacity: isHovered ? 0.15 : 0.08,
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transform: isHovered ? 'scaleX(1.02)' : 'scaleX(1)'
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
          marginBottom: screenSize === 'mobile' ? '16px' : '20px',
          flexShrink: 0,
          minHeight: '40px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: columnConfig.bg,
            borderRadius: '12px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '36px',
            height: '36px',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
            boxShadow: isHovered ? `0 4px 12px ${columnConfig.accentColor}40` : 'none'
          }}>
            <span style={{ fontSize: '18px' }}>{columnConfig.emoji}</span>
          </div>
          <Title 
            level={5}
            style={{
              fontWeight: '700',
              background: columnConfig.bg,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: screenSize === 'mobile' ? '16px' : screenSize === 'tablet' ? '17px' : '18px',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              lineHeight: '1.2',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'translateX(2px)' : 'translateX(0)'
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
            fontSize: '12px',
            minWidth: '28px',
            height: '28px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
          size={screenSize === 'mobile' ? 'default' : 'default'}
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
          paddingRight: '4px',
          scrollbarWidth: 'thin',
          scrollbarColor: `${columnConfig.accentColor}40 transparent`
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
              borderRadius: '16px',
              padding: screenSize === 'mobile' ? '20px' : '28px',
              textAlign: 'center',
              background: `linear-gradient(135deg, ${columnConfig.accentColor}15, ${columnConfig.accentColor}08)`,
              marginBottom: '16px',
              animation: 'pulse 2s infinite',
              backdropFilter: 'blur(10px)'
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
              boxShadow: `0 4px 12px ${columnConfig.accentColor}40`
            }}>
              <PlusOutlined style={{ color: 'white', fontSize: '20px' }} />
            </div>
            <Text style={{ 
              color: columnConfig.accentColor, 
              fontSize: screenSize === 'mobile' ? '14px' : '16px',
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
              padding: screenSize === 'mobile' ? '24px 16px' : '40px 20px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${columnConfig.accentColor}12, ${columnConfig.accentColor}06)`,
              border: `2px dashed ${columnConfig.accentColor}40`,
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{
              background: columnConfig.bg,
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              opacity: 0.8,
              boxShadow: `0 4px 12px ${columnConfig.accentColor}30`
            }}>
              <span style={{ fontSize: '24px' }}>{columnConfig.emoji}</span>
            </div>
            <Text type="secondary" style={{ 
              fontSize: screenSize === 'mobile' ? '14px' : '15px',
              color: columnConfig.accentColor + '90',
              fontWeight: '500',
              display: 'block',
              marginBottom: '4px'
            }}>
              No tasks yet
            </Text>
            <Text type="secondary" style={{ 
              fontSize: screenSize === 'mobile' ? '12px' : '13px',
              color: columnConfig.accentColor + '70'
            }}>
              Drag tasks here or create new ones
            </Text>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .scrollable::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollable::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollable::-webkit-scrollbar-thumb {
          background: ${columnConfig.accentColor}40;
          border-radius: 3px;
        }
        
        .scrollable::-webkit-scrollbar-thumb:hover {
          background: ${columnConfig.accentColor}60;
        }
      `}</style>
    </div>
  );
};

export default Column;