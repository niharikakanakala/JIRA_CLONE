import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from 'antd';
import Board from '../Board/Board';
import BacklogView from '../Backlog/BacklogView';
import ReportsView from '../Reports/ReportsView';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import TaskModal from '../Modal/TaskModal';
import Notification from '../Notifications/Notification';
import { initialTasks, backlogTasks } from '../../data/mockData';
import { generateId } from '../../utils/helpers';

const { Content, Sider } = Layout;

const MainLayout = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [backlogTasksList, setBacklogTasksList] = useState(backlogTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [screenSize, setScreenSize] = useState('desktop');
  const [currentView, setCurrentView] = useState('board');
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 499) {
        setScreenSize('mobile');
      } else if (width <= 768) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addNotification = useCallback((message, type = 'success') => {
    const id = generateId();
    setNotifications(prev => [...prev, { id, message, type, timestamp: Date.now() }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setNotificationsOpen(false);
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotificationsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsOpen && !event.target.closest('#notifications-btn') && !event.target.closest('#notifications-dropdown')) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = currentView === 'backlog' 
      ? backlogTasksList.find(t => t.id === taskId)
      : tasks.find(t => t.id === taskId);
    
    console.log('Deleting task:', taskId, taskToDelete);
    
    if (currentView === 'backlog') {
      setBacklogTasksList(prev => {
        const newList = prev.filter(task => task.id !== taskId);
        console.log('New backlog list:', newList);
        return newList;
      });
      addNotification(`Backlog item "${taskToDelete?.title}" deleted!`, 'success');
    } else {
      setTasks(prev => {
        const newList = prev.filter(task => task.id !== taskId);
        console.log('New tasks list:', newList);
        return newList;
      });
      addNotification(`Task "${taskToDelete?.title}" deleted!`, 'success');
    }
  };

  const handleSaveTask = (taskData) => {
    console.log('Saving task:', taskData);
    
    if (editingTask) {
      const oldStatus = editingTask.status;
      const newStatus = taskData.status;
      
      console.log('Status change:', oldStatus, '->', newStatus);
      
      if (oldStatus === 'backlog') {
        setBacklogTasksList(prev => prev.filter(task => task.id !== editingTask.id));
      } else {
        setTasks(prev => prev.filter(task => task.id !== editingTask.id));
      }
      
      if (newStatus === 'backlog') {
        setBacklogTasksList(prev => [...prev, { ...taskData, status: 'backlog' }]);
        addNotification(`Task moved to backlog!`, 'info');
      } else {
        setTasks(prev => [...prev, taskData]);
        if (oldStatus === 'backlog') {
          addNotification(`Task moved from backlog to ${newStatus}!`, 'info');
        } else {
          addNotification('Task updated successfully!', 'success');
        }
      }
    } else {
      if (taskData.status === 'backlog') {
        setBacklogTasksList(prev => [...prev, { ...taskData, status: 'backlog' }]);
        addNotification('New backlog item created!', 'success');
      } else {
        setTasks(prev => [...prev, taskData]);
        addNotification('New task created!', 'success');
      }
    }
    
    setModalVisible(false);
    setEditingTask(null);
  };

  const handleMoveTask = (taskId, newStatus, fromStatus) => {
    console.log('Moving task:', taskId, 'from', fromStatus, 'to', newStatus);
    
    const taskToMove = tasks.find(task => task.id === taskId);
    
    if (!taskToMove) {
      console.error('Task not found:', taskId);
      return;
    }
    
    if (newStatus === 'backlog') {
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setBacklogTasksList(prev => [...prev, { 
        ...taskToMove, 
        status: 'backlog', 
        updated: new Date().toISOString() 
      }]);
      addNotification(`Task moved to backlog!`, 'info');
    } else {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus, updated: new Date().toISOString() }
            : task
        )
      );
      addNotification(`Task moved from ${fromStatus} to ${newStatus}!`, 'info');
    }
  };

  const getAllTasks = () => {
    return [...tasks, ...backlogTasksList];
  };

  const renderContent = () => {
    switch (currentView) {
      case 'backlog':
        return (
          <BacklogView 
            tasks={backlogTasksList}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            screenSize={screenSize}
          />
        );
      case 'reports':
        return (
          <ReportsView 
            allTasks={getAllTasks()}
            screenSize={screenSize}
          />
        );
      default:
        return (
          <Board
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            screenSize={screenSize}
          />
        );
    }
  };

  return (
    <Layout 
      id="jira-clone-app"
      style={{ 
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Toast Notifications */}
      <div 
        id="toast-notifications-container"
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {notifications.slice(0, 3).map(notification => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>

      <Header
        currentView={currentView}
        screenSize={screenSize}
        notifications={notifications}
        notificationsOpen={notificationsOpen}
        onCreateTask={handleCreateTask}
        onToggleNotifications={toggleNotifications}
        onRemoveNotification={removeNotification}
        onClearAllNotifications={clearAllNotifications}
      />

      <Layout style={{ height: 'calc(100vh - 64px)' }}>
        {/* Use Ant Design Sider for proper layout */}
        <Sider
          width={screenSize === 'mobile' ? 60 : 200}
          style={{
            background: 'white',
            borderRight: '1px solid #f0f0f0',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Sidebar
              currentView={currentView}
              screenSize={screenSize}
              onViewChange={setCurrentView}
            />
          </div>
        </Sider>

        <Layout style={{ background: '#f5f5f5' }}>
          <Content 
            id="app-main-content"
            style={{
              background: '#f5f5f5',
              overflow: 'hidden',
              height: '100%'
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>

      <TaskModal
        visible={modalVisible}
        task={editingTask}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        screenSize={screenSize}
      />
    </Layout>
  );
};

export default MainLayout;