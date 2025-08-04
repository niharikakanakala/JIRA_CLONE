import React from 'react';
import { AlertCircle } from 'lucide-react';
import { STATUS_COLUMNS, TYPE_ICONS, PRIORITY_COLORS } from '../../utils/constants';
import { formatDate, sortTasksByDate, calculatePercentage } from '../../utils/helpers';

const ReportsView = ({ allTasks, screenSize }) => {
  const boardTasks = allTasks.filter(task => task.status !== 'backlog');
  const backlogTasks = allTasks.filter(task => task.status === 'backlog');
  
  const statusCounts = STATUS_COLUMNS.reduce((acc, column) => {
    acc[column.key] = boardTasks.filter(task => task.status === column.key).length;
    return acc;
  }, {});

  const priorityCounts = ['high', 'medium', 'low'].reduce((acc, priority) => {
    acc[priority] = allTasks.filter(task => task.priority === priority).length;
    return acc;
  }, {});

  const recentTasks = sortTasksByDate(allTasks, 'updated', 'desc').slice(0, 15);
  const totalTasks = allTasks.length;

  return (
    <div 
      id="reports-view" 
      className="w-full h-full overflow-y-auto overflow-x-hidden scrollable"
      style={{ 
        height: 'calc(100vh - 80px)',
        paddingBottom: '150px',
        paddingTop: '10px'
      }}
    >
      <div className="p-4 w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Reports</h2>
          <p className="text-gray-600">Track your project progress and metrics</p>
          <div className="mt-2 text-sm text-gray-500">
            Total Tasks: {totalTasks} | Board Tasks: {boardTasks.length} | Backlog: {backlogTasks.length}
          </div>
        </div>

        <div className="space-y-6">
          {/* Project Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.done || 0}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.progress || 0}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{backlogTasks.length}</div>
              <div className="text-sm text-gray-600">Backlog Items</div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
            <div className="space-y-3">
              {STATUS_COLUMNS.map(column => {
                const count = statusCounts[column.key] || 0;
                const percentage = calculatePercentage(count, boardTasks.length);
                return (
                  <div key={column.key} className="flex justify-between items-center">
                    <span className="text-gray-700">{column.title}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                      <span className="text-xs text-gray-500 w-10 text-right">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
            <div className="space-y-3">
              {Object.entries(priorityCounts).map(([priority, count]) => {
                const percentage = calculatePercentage(count, totalTasks);
                const color = priority === 'high' ? 'bg-red-500' : 
                            priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
                return (
                  <div key={priority} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{priority} Priority</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                      <span className="text-xs text-gray-500 w-10 text-right">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Types Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Task Types Distribution</h3>
            <div className="space-y-3">
              {Object.keys(TYPE_ICONS).map(type => {
                const count = allTasks.filter(task => task.type === type).length;
                const percentage = calculatePercentage(count, totalTasks);
                return (
                  <div key={type} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {React.createElement(TYPE_ICONS[type], { size: 16, className: "text-gray-600" })}
                      <span className="text-gray-700 capitalize">{type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                      <span className="text-xs text-gray-500 w-10 text-right">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {recentTasks.map(task => (
                <div key={task.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-2 flex-1">
                    {React.createElement(TYPE_ICONS[task.type], { size: 14, className: "text-gray-600" })}
                    <span className="text-sm truncate flex-1">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-1 rounded text-xs ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(task.updated)}</span>
                  </div>
                </div>
              ))}
              {recentTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>No recent activity found.</p>
                </div>
              )}
            </div>
          </div>

          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;