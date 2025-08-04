import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { STATUS_COLUMNS } from '../../utils/constants';
import { generateId } from '../../utils/helpers';

const TaskModal = ({ visible, task, onClose, onSave, screenSize }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    type: 'task',
    assignee: '',
    reporter: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({ ...task });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        type: 'task',
        assignee: '',
        reporter: ''
      });
    }
  }, [task, visible]);

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    const taskData = {
      ...formData,
      id: task?.id || generateId(),
      updated: new Date().toISOString(),
      created: task?.created || new Date().toISOString()
    };
    
    onSave(taskData);
  };

  if (!visible) return null;

  const modalClasses = screenSize === 'mobile' 
    ? 'w-11/12 max-w-sm p-4' 
    : screenSize === 'tablet'
    ? 'w-4/5 max-w-md p-6'
    : 'w-1/2 max-w-lg p-8';

  const inputClasses = screenSize === 'mobile' 
    ? 'text-sm p-2' 
    : screenSize === 'tablet'
    ? 'text-sm p-3'
    : 'text-base p-3';

  return (
    <div 
      id="task-modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        id="task-modal"
        className={`bg-white rounded-lg shadow-xl max-h-full overflow-y-auto scrollable ${modalClasses}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              id="task-title-input"
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full border border-gray-300 rounded-md ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter task title"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="task-description-input"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full border border-gray-300 rounded-md ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={3}
              placeholder="Enter task description"
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                id="task-status-select"
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className={`w-full border border-gray-300 rounded-md ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {STATUS_COLUMNS.map(col => (
                  <option key={col.key} value={col.key}>
                    {col.title}
                  </option>
                ))}
                <option value="backlog">Backlog</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority *</label>
              <select
                id="task-priority-select"
                value={formData.priority}
                onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className={`w-full border border-gray-300 rounded-md ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                id="task-type-select"
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className={`w-full border border-gray-300 rounded-md ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="story">Story</option>
                <option value="bug">Bug</option>
                <option value="task">Task</option>
                <option value="feature">Feature</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Assignee</label>
              <input
                id="task-assignee-input"
                type="text"
                value={formData.assignee}
                onChange={e => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                className={`w-full border border-gray-300 rounded-md ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter assignee name"
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reporter</label>
            <input
              id="task-reporter-input"
              type="text"
              value={formData.reporter}
              onChange={e => setFormData(prev => ({ ...prev, reporter: e.target.value }))}
              className={`w-full border border-gray-300 rounded-md ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter reporter name"
              maxLength={50}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            id="cancel-task-btn"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            id="save-task-btn"
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {task ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;