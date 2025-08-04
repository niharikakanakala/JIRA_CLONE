import React, { useState } from 'react';
import { Badge, Typography, Empty } from 'antd';
import TaskCard from './TaskCard';

const { Text, Title } = Typography;

const Column = ({ column, tasks, onEdit, onDelete, onMove, screenSize, columnIndex }) => {
  const [isDragOver, setIsDragOver] = useState(false);

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
    if (screenSize === 'mobile') return 'calc((100vh - 80px) / 2 - 8px)'; // Half height for 2x2 grid
    return 'calc(100vh - 140px)'; // Full height for single row
  };

  const getPadding = () => {
    if (screenSize === 'mobile') return '8px';
    if (screenSize === 'tablet') return '12px';
    return '16px';
  };

  const getMinWidth = () => {
    if (screenSize === 'mobile') return '150px';
    if (screenSize === 'tablet') return '200px';
    return '250px';
  };

  const getColumnBackground = (columnKey) => {
    switch (columnKey) {
      case 'todo': return '#f7f8fc';
      case 'progress': return '#e3fcef';
      case 'review': return '#fff4e6';
      case 'done': return '#e3fcef';
      default: return '#f7f8fc';
    }
  };

  // Better title handling
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

  return (
    <div 
      id={`column-${column.key}`}
      className={`jira-column jira-column-${column.key} ${column.color}`}
      data-testid={`column-${column.key}`}
      data-column-status={column.key}
      data-column-index={columnIndex}
      style={{
        background: isDragOver ? '#dbeafe' : getColumnBackground(column.key),
        borderRadius: '8px',
        padding: getPadding(),
        display: 'flex',
        flexDirection: 'column',
        height: getColumnHeight(),
        minHeight: screenSize === 'mobile' ? '180px' : '300px',
        minWidth: getMinWidth(),
        border: isDragOver ? '2px dashed #36b37e' : '1px solid #e1e4e9',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div 
        id={`column-header-${column.key}`}
        className="jira-column-header"
        data-testid={`column-header-${column.key}`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 0,
          marginRight: 0,
          marginBottom: screenSize === 'mobile' ? '8px' : '12px',
          marginLeft: 0,
          flexShrink: 0,
          minHeight: '24px'
        }}
      >
        <Title 
          id={`column-title-${column.key}`}
          className="jira-column-title"
          data-testid={`column-title-${column.key}`}
          level={5}
          style={{
            fontWeight: '600',
            color: '#172b4d',
            fontSize: screenSize === 'mobile' ? '12px' : screenSize === 'tablet' ? '13px' : '14px',
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            lineHeight: '1.2'
          }}
        >
          {getColumnTitle()}
        </Title>
        <Badge 
          id={`column-count-${column.key}`}
          className="jira-column-count"
          data-testid={`column-count-${column.key}`}
          data-task-count={tasks.length}
          count={tasks.length}
          style={{
            backgroundColor: '#ddd',
            color: '#666',
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: '8px'
          }}
          size={screenSize === 'mobile' ? 'small' : 'default'}
        />
      </div>

      {/* Tasks Container - Scrollable */}
      <div 
        id={`column-tasks-${column.key}`}
        className="jira-column-content scrollable"
        data-testid={`column-tasks-${column.key}`}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
          paddingRight: '2px'
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
        
        {/* Drop Zone Indicator */}
        {isDragOver && (
          <div 
            id={`drop-zone-${column.key}`}
            className="jira-drop-zone"
            data-testid={`drop-zone-${column.key}`}
            style={{
              border: '2px dashed #36b37e',
              borderRadius: '6px',
              padding: screenSize === 'mobile' ? '8px' : '12px',
              textAlign: 'center',
              color: '#36b37e',
              backgroundColor: '#e3fcef',
              fontSize: screenSize === 'mobile' ? '11px' : '12px',
              marginTop: 0,
              marginRight: 0,
              marginBottom: '8px',
              marginLeft: 0
            }}
          >
            <Text style={{ color: '#36b37e', fontSize: screenSize === 'mobile' ? '11px' : '12px' }}>
              Drop task here
            </Text>
          </div>
        )}
        
        {/* Empty State */}
        {tasks.length === 0 && !isDragOver && (
          <div 
            id={`empty-state-${column.key}`}
            className="jira-empty-state"
            data-testid={`empty-state-${column.key}`}
            style={{
              textAlign: 'center',
              padding: screenSize === 'mobile' ? '12px 8px' : '20px 8px'
            }}
          >
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text type="secondary" style={{ fontSize: screenSize === 'mobile' ? '10px' : '11px' }}>
                  No tasks
                </Text>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;