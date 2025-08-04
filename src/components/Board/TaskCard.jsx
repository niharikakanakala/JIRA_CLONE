import React, { useState } from 'react';
import { Edit, Trash2, User } from 'lucide-react';
import { TYPE_ICONS, PRIORITY_COLORS } from '../../utils/constants';

const TaskCard = ({ task, onEdit, onDelete, screenSize, taskIndex, columnStatus }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '12px',
        marginBottom: '8px',
        cursor: 'grab',
        position: 'relative',
        transition: 'all 0.2s ease',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(2deg) scale(1.05)' : 'none'
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {/* Action Menu - Consistent positioning */}
      {showMenu && (
        <div 
          id={`task-actions-${task.id}`}
          className="jira-task-actions"
          data-testid={`task-actions-${task.id}`}
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            display: 'flex',
            gap: '4px',
            zIndex: 20,
            backgroundColor: 'white',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: '4px'
          }}
        >
          <button
            id={`edit-task-btn-${task.id}`}
            className="jira-edit-btn"
            data-testid={`edit-task-btn-${task.id}`}
            data-action="edit"
            data-task-id={task.id}
            onClick={handleEditClick}
            title="Edit task"
            style={{
              padding: '4px',
              backgroundColor: '#dbeafe',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Edit size={12} style={{ color: '#2563eb' }} />
          </button>
          <button
            id={`delete-task-btn-${task.id}`}
            className="jira-delete-btn"
            data-testid={`delete-task-btn-${task.id}`}
            data-action="delete"
            data-task-id={task.id}
            onClick={handleDeleteClick}
            title="Delete task"
            style={{
              padding: '4px',
              backgroundColor: '#fee2e2',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trash2 size={12} style={{ color: '#dc2626' }} />
          </button>
        </div>
      )}
      
      {/* Task Header - Consistent layout */}
      <div 
        id={`task-header-${task.id}`}
        className="jira-task-header"
        data-testid={`task-header-${task.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}
      >
        <IconComponent 
          size={16} 
          style={{ color: '#6b7280', flexShrink: 0 }} 
        />
        <span 
          id={`task-title-${task.id}`}
          className="jira-task-title"
          data-testid={`task-title-${task.id}`}
          style={{
            fontWeight: '500',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '14px',
            color: '#374151'
          }}
        >
          {task.title}
        </span>
      </div>
      
      {/* Task Description - Consistent layout */}
      <p 
        id={`task-description-${task.id}`}
        className="jira-task-description"
        data-testid={`task-description-${task.id}`}
        style={{
          color: '#6b7280',
          marginBottom: '12px',
          fontSize: '12px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {task.description}
      </p>
      
      {/* Task Footer - Consistent layout */}
      <div 
        id={`task-footer-${task.id}`}
        className="jira-task-footer"
        data-testid={`task-footer-${task.id}`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span 
          id={`task-priority-${task.id}`}
          className={`jira-priority-badge jira-priority-${task.priority}`}
          data-testid={`task-priority-${task.id}`}
          data-priority={task.priority}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '500',
            textTransform: 'uppercase',
            color: task.priority === 'high' ? '#dc2626' : 
                   task.priority === 'medium' ? '#d97706' : '#16a34a',
            backgroundColor: task.priority === 'high' ? '#fee2e2' : 
                            task.priority === 'medium' ? '#fef3c7' : '#dcfce7'
          }}
        >
          {task.priority}
        </span>
        <div 
          id={`task-assignee-${task.id}`}
          className="jira-assignee-avatar"
          data-testid={`task-assignee-${task.id}`}
          data-assignee={task.assignee}
          title={task.assignee}
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#dbeafe',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <User size={12} style={{ color: '#2563eb' }} />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;