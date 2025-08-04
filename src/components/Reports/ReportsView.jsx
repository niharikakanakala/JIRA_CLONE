import React from 'react';
import { Card, Row, Col, Progress, Typography, Empty } from 'antd';
import { AlertCircle } from 'lucide-react';
import { STATUS_COLUMNS, TYPE_ICONS, PRIORITY_COLORS } from '../../utils/constants';
import { formatDate, sortTasksByDate, calculatePercentage } from '../../utils/helpers';

const { Title, Text } = Typography;

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

  const getProgressColor = (type) => {
    switch (type) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#1890ff';
    }
  };

  return (
    <div 
      id="reports-view" 
      className="reports-container scrollable"
      style={{ 
        height: 'calc(100vh - 64px)',
        padding: '20px',
        overflow: 'auto'
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ marginBottom: '8px', color: '#262626' }}>
          Project Reports
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Track your project progress and metrics
        </Text>
        <div style={{ marginTop: '8px' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Total Tasks: {totalTasks} | Board Tasks: {boardTasks.length} | Backlog: {backlogTasks.length}
          </Text>
        </div>
      </div>

      {/* Project Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff', marginBottom: '8px' }}>
              {totalTasks}
            </div>
            <Text type="secondary">Total Tasks</Text>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a', marginBottom: '8px' }}>
              {statusCounts.done || 0}
            </div>
            <Text type="secondary">Completed</Text>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#faad14', marginBottom: '8px' }}>
              {statusCounts.progress || 0}
            </div>
            <Text type="secondary">In Progress</Text>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8c8c8c', marginBottom: '8px' }}>
              {backlogTasks.length}
            </div>
            <Text type="secondary">Backlog Items</Text>
          </Card>
        </Col>
      </Row>

      {/* Status Distribution */}
      <Card title="Status Distribution" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STATUS_COLUMNS.map(column => {
            const count = statusCounts[column.key] || 0;
            const percentage = calculatePercentage(count, boardTasks.length);
            return (
              <div key={column.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>{column.title}</Text>
                  <Text>
                    <strong>{count}</strong> ({percentage}%)
                  </Text>
                </div>
                <Progress 
                  percent={percentage} 
                  showInfo={false}
                  strokeColor="#1890ff"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Priority Distribution */}
      <Card title="Priority Distribution" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(priorityCounts).map(([priority, count]) => {
            const percentage = calculatePercentage(count, totalTasks);
            return (
              <div key={priority}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text style={{ textTransform: 'capitalize' }}>{priority} Priority</Text>
                  <Text>
                    <strong>{count}</strong> ({percentage}%)
                  </Text>
                </div>
                <Progress 
                  percent={percentage} 
                  showInfo={false}
                  strokeColor={getProgressColor(priority)}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Task Types Distribution */}
      <Card title="Task Types Distribution" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.keys(TYPE_ICONS).map(type => {
            const count = allTasks.filter(task => task.type === type).length;
            const percentage = calculatePercentage(count, totalTasks);
            const IconComponent = TYPE_ICONS[type];
            return (
              <div key={type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconComponent size={16} />
                    <Text style={{ textTransform: 'capitalize' }}>{type}</Text>
                  </div>
                  <Text>
                    <strong>{count}</strong> ({percentage}%)
                  </Text>
                </div>
                <Progress 
                  percent={percentage} 
                  showInfo={false}
                  strokeColor="#722ed1"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card title="Recent Activity" style={{ marginBottom: '100px' }}>
        {recentTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTasks.map(task => {
              const IconComponent = TYPE_ICONS[task.type];
              const priorityColor = task.priority === 'high' ? '#ff4d4f' : 
                                  task.priority === 'medium' ? '#faad14' : '#52c41a';
              return (
                <div 
                  key={task.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <IconComponent size={16} style={{ color: '#8c8c8c' }} />
                    <Text ellipsis style={{ flex: 1 }}>{task.title}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span 
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        fontWeight: '500',
                        color: priorityColor,
                        backgroundColor: task.priority === 'high' ? '#fff1f0' : 
                                       task.priority === 'medium' ? '#fffbe6' : '#f6ffed'
                      }}
                    >
                      {task.priority}
                    </span>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {formatDate(task.updated)}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty 
            image={<AlertCircle size={48} style={{ color: '#d9d9d9' }} />}
            description="No recent activity found."
          />
        )}
      </Card>
    </div>
  );
};

export default ReportsView;