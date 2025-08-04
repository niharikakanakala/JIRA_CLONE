import React from 'react';
import Column from './Column';
import { STATUS_COLUMNS } from '../../utils/constants';

const Board = ({ tasks, onEdit, onDelete, onMove, screenSize }) => {
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Better responsive grid layout
  const getGridColumns = () => {
    if (screenSize === 'mobile') return 'repeat(2, 1fr)'; // 2 columns on mobile
    if (screenSize === 'tablet') return 'repeat(4, 1fr)'; // 4 columns on tablet
    return 'repeat(4, 1fr)'; // 4 columns on desktop
  };

  const getGridRows = () => {
    if (screenSize === 'mobile') return 'repeat(2, 1fr)'; // 2 rows on mobile
    return '1fr'; // Single row on tablet/desktop
  };

  // Better gap and padding for mobile
  const getGap = () => {
    if (screenSize === 'mobile') return '8px';
    if (screenSize === 'tablet') return '12px';
    return '16px';
  };

  const getPadding = () => {
    if (screenSize === 'mobile') return '8px';
    if (screenSize === 'tablet') return '12px';
    return '16px';
  };

  const getHeight = () => {
    if (screenSize === 'mobile') return 'calc(100vh - 80px)';
    return 'calc(100vh - 120px)';
  };

  return (
    <div 
      id="kanban-board"
      className="jira-board-grid"
      data-testid="kanban-board"
      style={{ 
        display: 'grid',
        gap: getGap(),
        height: getHeight(),
        padding: getPadding(),
        gridTemplateColumns: getGridColumns(),
        gridTemplateRows: getGridRows(),
        background: '#f5f5f5',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '400px'
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