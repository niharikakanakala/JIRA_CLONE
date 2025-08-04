import React, { useState } from 'react';
import TaskCard from './TaskCard';

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

  // Calculate responsive dimensions
  const getColumnHeight = () => {
    if (screenSize === 'mobile') return 'calc((100vh - 100px) / 2 - 8px)'; // Half height for 2x2 grid
    return 'calc(100vh - 120px)'; // Full height for single row
  };

  const getPadding = () => {
    if (screenSize === 'mobile') return '6px';
    if (screenSize === 'tablet') return '8px';
    return '12px';
  };

  const getFontSize = () => {
    if (screenSize === 'mobile') return '12px';
    if (screenSize === 'tablet') return '14px';
    return '16px';
  };

  return (
    <div 
      id={`column-${column.key}`}
      className={`jira-column jira-column-${column.key} ${column.color}`}
      data-testid={`column-${column.key}`}
      data-column-status={column.key}
      data-column-index={columnIndex}
      style={{
        borderRadius: '6px',
        padding: getPadding(),
        display: 'flex',
        flexDirection: 'column',
        height: getColumnHeight(),
        minHeight: screenSize === 'mobile' ? '150px' : '200px',
        border: isDragOver ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        backgroundColor: isDragOver ? '#dbeafe' : undefined,
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header - Compact for mobile */}
      <div 
        id={`column-header-${column.key}`}
        className="jira-column-header"
        data-testid={`column-header-${column.key}`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: screenSize === 'mobile' ? '6px' : '8px',
          flexShrink: 0
        }}
      >
        <h3 
          id={`column-title-${column.key}`}
          className="jira-column-title"
          data-testid={`column-title-${column.key}`}
          style={{
            fontWeight: '600',
            color: '#374151',
            fontSize: getFontSize(),
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}
        >
          {screenSize === 'mobile' ? column.title.split(' ')[0] : column.title}
        </h3>
        <span 
          id={`column-count-${column.key}`}
          className="jira-column-count"
          data-testid={`column-count-${column.key}`}
          data-task-count={tasks.length}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: screenSize === 'mobile' ? '2px 6px' : '4px 8px',
            borderRadius: '9999px',
            fontSize: screenSize === 'mobile' ? '10px' : '12px',
            fontWeight: '500',
            marginLeft: '4px'
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Tasks Container - Scrollable */}
      <div 
        id={`column-tasks-${column.key}`}
        className="jira-column-tasks scrollable"
        data-testid={`column-tasks-${column.key}`}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
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
              border: '2px dashed #3b82f6',
              borderRadius: '6px',
              padding: screenSize === 'mobile' ? '8px' : '12px',
              textAlign: 'center',
              color: '#3b82f6',
              backgroundColor: '#dbeafe',
              fontSize: screenSize === 'mobile' ? '10px' : '12px'
            }}
          >
            Drop here
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
              padding: screenSize === 'mobile' ? '12px 4px' : '20px 8px',
              color: '#9ca3af',
              fontSize: screenSize === 'mobile' ? '10px' : '11px'
            }}
          >
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;