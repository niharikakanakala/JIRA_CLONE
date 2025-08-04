import React from 'react';
import Column from './Column';
import { STATUS_COLUMNS } from '../../utils/constants';

const Board = ({ tasks, onEdit, onDelete, onMove, screenSize }) => {
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Fixed responsive layout - better breakpoints
  const getLayoutConfig = () => {
    const viewportWidth = window.innerWidth;
    
    // Mobile: 2x2 grid layout (much better UX)
    if (screenSize === 'mobile' || viewportWidth <= 768) {
      return {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '8px',
        overflow: 'hidden'
      };
    }
    
    // Tablet: 2x2 grid layout
    if (screenSize === 'tablet' || (viewportWidth > 768 && viewportWidth <= 1024)) {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '12px',
        overflow: 'hidden'
      };
    }
    
    // Desktop and larger screens: Always show all 4 columns in a row
    return {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: '1fr',
      gap: '16px',
      overflow: 'hidden'
    };
  };

  const getPadding = () => {
    if (screenSize === 'mobile') return '8px';
    if (screenSize === 'tablet') return '12px';
    return '16px';
  };

  const getHeight = () => {
    // All screen sizes now use fixed height since we're using grid
    return 'calc(100vh - 140px)';
  };

  const layoutConfig = getLayoutConfig();

  return (
    <div 
      id="kanban-board"
      className="jira-board-grid"
      data-testid="kanban-board"
      style={{ 
        ...layoutConfig,
        height: getHeight(),
        padding: getPadding(),
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '400px',
        maxWidth: '100vw'
      }}
    >
      {STATUS_COLUMNS.map((column, index) => (
        <Column
          key={column.key}
          column={column}
          tasks={getTasksByStatus(column.key)}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
          screenSize={screenSize}
          columnIndex={index}
        />
      ))}
    </div>
  );
};

export default Board;