import React from 'react';
import Column from './Column';
import { STATUS_COLUMNS } from '../../utils/constants';

const Board = ({ tasks, onEdit, onDelete, onMove, screenSize }) => {
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Calculate responsive grid based on screen size
  const getGridColumns = () => {
    if (screenSize === 'mobile') return 'repeat(2, 1fr)'; // 2x2 grid on mobile
    if (screenSize === 'tablet') return 'repeat(4, 1fr)'; // 4 columns on tablet
    return 'repeat(4, 1fr)'; // 4 columns on desktop
  };

  const getGridRows = () => {
    if (screenSize === 'mobile') return 'repeat(2, 1fr)'; // 2 rows on mobile
    return '1fr'; // Single row on tablet/desktop
  };

  return (
    <div 
      id="kanban-board"
      className="jira-board-grid"
      data-testid="kanban-board"
      style={{ 
        display: 'grid',
        gap: screenSize === 'mobile' ? '8px' : '12px',
        height: 'calc(100vh - 120px)',
        padding: screenSize === 'mobile' ? '8px' : '12px',
        gridTemplateColumns: getGridColumns(),
        gridTemplateRows: getGridRows(),
        background: '#f5f5f5',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box'
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