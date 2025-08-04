import React from 'react';
import Column from './Column';
import { STATUS_COLUMNS } from '../../utils/constants';

const Board = ({ tasks, onEdit, onDelete, onMove, screenSize }) => {
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div 
      id="kanban-board"
      className="jira-board-container"
      data-testid="kanban-board"
      style={{ 
        height: 'calc(100vh - 80px)',
        padding: '8px',
        display: 'grid',
        gridTemplateColumns: screenSize === 'mobile' ? '1fr' : 'repeat(4, 1fr)',
        gap: '8px',
        overflow: screenSize === 'mobile' ? 'auto' : 'hidden'
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