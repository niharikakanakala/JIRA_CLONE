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

  return (
    <div 
      id={`column-${column.key}`}
      className={`jira-column jira-column-${column.key} ${column.color}`}
      data-testid={`column-${column.key}`}
      data-column-status={column.key}
      data-column-index={columnIndex}
      style={{
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        height: screenSize === 'mobile' ? 'auto' : 'calc(100vh - 120px)',
        minHeight: screenSize === 'mobile' ? '200px' : '400px',
        border: isDragOver ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        backgroundColor: isDragOver ? '#dbeafe' : undefined,
        transition: 'all 0.2s ease'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header - Consistent across all screens */}
      <div 
        id={`column-header-${column.key}`}
        className="jira-column-header"
        data-testid={`column-header-${column.key}`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
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
            fontSize: screenSize === 'mobile' ? '14px' : '16px',
            margin: 0
          }}
        >
          {column.title}
        </h3>
        <span 
          id={`column-count-${column.key}`}
          className="jira-column-count"
          data-testid={`column-count-${column.key}`}
          data-task-count={tasks.length}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Tasks Container - Consistent scrolling */}
      <div 
        id={`column-tasks-${column.key}`}
        className="jira-column-tasks scrollable"
        data-testid={`column-tasks-${column.key}`}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: 'calc(100% - 60px)',
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
        
        {/* Drop Zone Indicator */}
        {isDragOver && (
          <div 
            id={`drop-zone-${column.key}`}
            className="jira-drop-zone"
            data-testid={`drop-zone-${column.key}`}
            style={{
              border: '2px dashed #3b82f6',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              color: '#3b82f6',
              backgroundColor: '#dbeafe',
              fontSize: '14px'
            }}
          >
            Drop task here
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
              padding: '32px 16px',
              color: '#9ca3af',
              fontSize: '12px'
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