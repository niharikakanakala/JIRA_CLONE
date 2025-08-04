import React from 'react';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import { TYPE_ICONS, PRIORITY_COLORS } from '../../utils/constants';
import { formatDate, sortTasksByDate } from '../../utils/helpers';

const BacklogView = ({ tasks, onEdit, onDelete, screenSize }) => {
  const sortedTasks = sortTasksByDate(tasks, 'updated', 'desc');

  return (
    <div 
      id="backlog-view" 
      className="w-full h-full overflow-y-auto overflow-x-hidden scrollable"
      style={{ 
        height: 'calc(100vh - 80px)',
        paddingBottom: '150px',
        paddingTop: '10px'
      }}
    >
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Backlog</h2>
          <p className="text-gray-600">Manage your product backlog and plan future sprints</p>
          <div className="mt-2 text-sm text-gray-500">
            Total items: {tasks.length} | Last updated: {formatDate(new Date().toISOString())}
          </div>
        </div>
        
        <div className="space-y-3">
          {sortedTasks.map(task => (
            <div 
              key={task.id}
              id={`backlog-item-${task.id}`}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {React.createElement(TYPE_ICONS[task.type], { size: 16, className: "text-gray-600" })}
                    <span className="font-medium">{task.title}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  <div className="text-xs text-gray-500">
                    Assignee: {task.assignee} | Reporter: {task.reporter} | Updated: {formatDate(task.updated)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    id={`edit-backlog-item-${task.id}`}
                    onClick={() => onEdit(task)}
                    className="p-1 bg-blue-100 rounded hover:bg-blue-200"
                    title="Edit item"
                  >
                    <Edit size={14} className="text-blue-600" />
                  </button>
                  <button
                    id={`delete-backlog-item-${task.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      // Direct delete without confirmation
                      console.log('Deleting backlog item directly:', task.id);
                      onDelete(task.id);
                    }}
                    className="p-1 bg-red-100 rounded hover:bg-red-200"
                    title="Delete item"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No backlog items found. Create your first item to get started!</p>
            </div>
          )}
        </div>
        
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default BacklogView;