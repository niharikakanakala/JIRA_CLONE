import React from 'react';
import { Card, Button, Tag, Empty, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AlertCircle } from 'lucide-react';
import { TYPE_ICONS, PRIORITY_COLORS } from '../../utils/constants';
import { formatDate, sortTasksByDate } from '../../utils/helpers';

const { Title, Text, Paragraph } = Typography;

const BacklogView = ({ tasks, onEdit, onDelete, screenSize }) => {
  const sortedTasks = sortTasksByDate(tasks, 'updated', 'desc');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  return (
    <div 
      id="backlog-view" 
      className="backlog-container scrollable"
      style={{ 
        height: 'calc(100vh - 64px)',
        padding: '20px',
        overflow: 'auto'
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ marginBottom: '8px', color: '#262626' }}>
          Product Backlog
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Manage your product backlog and plan future sprints
        </Text>
        <div style={{ marginTop: '8px' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Total items: {tasks.length} | Last updated: {formatDate(new Date().toISOString())}
          </Text>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedTasks.map(task => {
          const IconComponent = TYPE_ICONS[task.type];
          return (
            <Card 
              key={task.id}
              id={`backlog-item-${task.id}`}
              className="backlog-item"
              style={{ 
                background: 'white',
                border: '1px solid #f0f0f0',
                borderRadius: '8px'
              }}
              bodyStyle={{ padding: '16px' }}
              hoverable
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <IconComponent size={16} style={{ color: '#8c8c8c' }} />
                    <Text strong style={{ fontSize: '16px' }}>{task.title}</Text>
                    <Tag color={getPriorityColor(task.priority)} size="small">
                      {task.priority.toUpperCase()}
                    </Tag>
                  </div>
                  <Paragraph 
                    type="secondary" 
                    style={{ fontSize: '14px', marginBottom: '8px' }}
                    ellipsis={{ rows: 2, expandable: false }}
                  >
                    {task.description}
                  </Paragraph>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Assignee: {task.assignee || 'Unassigned'} | Reporter: {task.reporter || 'Unknown'} | Updated: {formatDate(task.updated)}
                  </Text>
                </div>
                <Space size="small">
                  <Button
                    id={`edit-backlog-item-${task.id}`}
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(task)}
                    title="Edit item"
                    style={{ 
                      color: '#1890ff',
                      backgroundColor: '#e6f7ff'
                    }}
                  />
                  <Button
                    id={`delete-backlog-item-${task.id}`}
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      // Direct delete without confirmation
                      console.log('Deleting backlog item directly:', task.id);
                      onDelete(task.id);
                    }}
                    title="Delete item"
                    style={{ 
                      color: '#ff4d4f',
                      backgroundColor: '#fff1f0'
                    }}
                  />
                </Space>
              </div>
            </Card>
          );
        })}
        
        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Empty 
              image={<AlertCircle size={48} style={{ color: '#d9d9d9' }} />}
              description={
                <div>
                  <Text type="secondary">No backlog items found.</Text>
                  <br />
                  <Text type="secondary">Create your first item to get started!</Text>
                </div>
              }
            />
          </div>
        )}
      </div>
      
      <div style={{ height: '80px' }}></div>
    </div>
  );
};

export default BacklogView;