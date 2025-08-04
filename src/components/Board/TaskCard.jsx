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

  // Responsive sizing
  const getCardPadding = () => {
    if (screenSize === 'mobile') return '6px';
    if (screenSize === 'tablet') return '8px';
    return '10px';
  };

  const getCardMargin = () => {
    if (screenSize === 'mobile') return '4px';
    return '6px';
  };

  const getTitleFontSize = () => {
    if (screenSize === 'mobile') return '11px';
    if (screenSize === 'tablet') return '12px';
    return '13px';
  };

  const getDescriptionFontSize = () => {
    if (screenSize === 'mobile') return '9px';
    if (screenSize === 'tablet') return '10px';
    return '11px';
  };

  const getIconSize = () => {
    if (screenSize === 'mobile') return 12;
    if (screenSize === 'tablet') return 14;
    return 16;
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
        borderRadius: '6px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        padding: getCardPadding(),
        marginBottom: getCardMargin(),
        cursor: 'grab',
        position: 'relative',
        transition: 'all 0.2s ease',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(1deg) scale(1.02)' : 'none',
        fontSize: getTitleFontSize()
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {/* Action Menu - Responsive positioning */}
      {showMenu && (
        <div 
          id={`task-actions-${task.id}`}
          className="jira-task-actions"
          data-testid={`task-actions-${task.id}`}
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            display: 'flex',
            gap: screenSize === 'mobile' ? '2px' : '3px',
            zIndex: 20,
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
            padding: screenSize === 'mobile' ? '2px' : '3px'
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
              padding: screenSize === 'mobile' ? '2px' : '3px',
              backgroundColor: '#dbeafe',
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Edit size={screenSize === 'mobile' ? 10 : 11} style={{ color: '#2563eb' }} />
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
              padding: screenSize === 'mobile' ? '2px' : '3px',
              backgroundColor: '#fee2e2',
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trash2 size={screenSize === 'mobile' ? 10 : 11} style={{ color: '#dc2626' }} />
          </button>
        </div>
      )}
      
      {/* Task Header - Compact layout */}
      <div 
        id={`task-header-${task.id}`}
        className="jira-task-header"
        data-testid={`task-header-${task.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: screenSize === 'mobile' ? '4px' : '6px',
          marginBottom: screenSize === 'mobile' ? '4px' : '6px'
        }}
      >
        <IconComponent 
          size={getIconSize()} 
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
            fontSize: getTitleFontSize(),
            color: '#374151',
            lineHeight: 1.2
          }}
        >
          {task.title}
        </span>
      </div>
      
      {/* Task Description - Compact layout */}
      <p 
        id={`task-description-${task.id}`}
        className="jira-task-description"
        data-testid={`task-description-${task.id}`}
        style={{
          color: '#6b7280',
          marginBottom: screenSize === 'mobile' ? '6px' : '8px',
          fontSize: getDescriptionFontSize(),
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: screenSize === 'mobile' ? 1 : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {task.description}
      </p>
      
      {/* Task Footer - Compact layout */}
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
            padding: screenSize === 'mobile' ? '2px 4px' : '3px 6px',
            borderRadius: '3px',
            fontSize: screenSize === 'mobile' ? '8px' : '9px',
            fontWeight: '500',
            textTransform: 'uppercase',
            color: task.priority === 'high' ? '#dc2626' : 
                   task.priority === 'medium' ? '#d97706' : '#16a34a',
            backgroundColor: task.priority === 'high' ? '#fee2e2' : 
                            task.priority === 'medium' ? '#fef3c7' : '#dcfce7'
          }}
        >
          {screenSize === 'mobile' ? task.priority.charAt(0).toUpperCase() : task.priority.toUpperCase()}
        </span>
        <div 
          id={`task-assignee-${task.id}`}
          className="jira-assignee-avatar"
          data-testid={`task-assignee-${task.id}`}
          data-assignee={task.assignee}
          title={task.assignee}
          style={{
            width: screenSize === 'mobile' ? '16px' : '20px',
            height: screenSize === 'mobile' ? '16px' : '20px',
            backgroundColor: '#dbeafe',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <User size={screenSize === 'mobile' ? 8 : 10} style={{ color: '#2563eb' }} />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;