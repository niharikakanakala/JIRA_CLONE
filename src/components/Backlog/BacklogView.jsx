import React, { useState } from 'react';
import { Card, Button, Tag, Empty, Typography, Space, Badge, Avatar, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { AlertCircle } from 'lucide-react';
import { TYPE_ICONS, PRIORITY_COLORS } from '../../utils/constants';
import { formatDate, sortTasksByDate } from '../../utils/helpers';

const { Title, Text, Paragraph } = Typography;

const BacklogView = ({ tasks, onEdit, onDelete, screenSize }) => {
  const sortedTasks = sortTasksByDate(tasks, 'updated', 'desc');

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high': 
        return { 
          color: 'red', 
          gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
          emoji: '🔥',
          bgColor: '#fff1f0'
        };
      case 'medium': 
        return { 
          color: 'orange', 
          gradient: 'linear-gradient(135deg, #ffa726, #ff9800)',
          emoji: '⚡',
          bgColor: '#fffbe6'
        };
      case 'low': 
        return { 
          color: 'green', 
          gradient: 'linear-gradient(135deg, #66bb6a, #4caf50)',
          emoji: '🌱',
          bgColor: '#f6ffed'
        };
      default: 
        return { 
          color: 'default', 
          gradient: 'linear-gradient(135deg, #78909c, #607d8b)',
          emoji: '📝',
          bgColor: '#f5f5f5'
        };
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case 'story': 
        return { 
          color: '#00d2d3', 
          bgGradient: 'linear-gradient(135deg, #00d2d3, #00bcd4)',
          emoji: '📚'
        };
      case 'bug': 
        return { 
          color: '#ff5722', 
          bgGradient: 'linear-gradient(135deg, #ff5722, #f44336)',
          emoji: '🐛'
        };
      case 'task': 
        return { 
          color: '#2196f3', 
          bgGradient: 'linear-gradient(135deg, #2196f3, #1976d2)',
          emoji: '✅'
        };
      case 'feature': 
        return { 
          color: '#9c27b0', 
          bgGradient: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
          emoji: '⭐'
        };
      default: 
        return { 
          color: '#2196f3', 
          bgGradient: 'linear-gradient(135deg, #2196f3, #1976d2)',
          emoji: '📝'
        };
    }
  };

  const BacklogCard = ({ task, index }) => {
    const IconComponent = TYPE_ICONS[task.type];
    const priorityConfig = getPriorityConfig(task.priority);
    const typeConfig = getTypeConfig(task.type);
    
    return (
      <Card 
        key={task.id}
        id={`backlog-item-${task.id}`}
        className="backlog-item"
        style={{ 
          background: 'white',
          border: `1px solid #f0f0f0`,
          borderLeft: `4px solid ${typeConfig.color}`,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          position: 'relative'
        }}
        styles={{ body: { padding: '20px' } }}
      >
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: typeConfig.bgGradient,
          borderRadius: '0 12px 0 100px',
          opacity: 0.05
        }} />

        {/* Status indicator */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '6px',
          padding: '2px 6px',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${typeConfig.color}30`,
          zIndex: 2
        }}>
          <Text style={{ fontSize: '9px', color: typeConfig.color, fontWeight: '600' }}>
            BACKLOG
          </Text>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header Section */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingRight: '60px' // Add space for status indicator
          }}>
            <div style={{ flex: 1 }}>
              {/* Task Type and Priority */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '8px'
              }}>
                <div style={{
                  background: typeConfig.bgGradient,
                  borderRadius: '8px',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '32px',
                  height: '32px'
                }}>
                  <IconComponent size={16} style={{ color: 'white' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                    <Text strong style={{ 
                      fontSize: screenSize === 'mobile' ? '14px' : '16px',
                      color: '#262626',
                      lineHeight: '1.3',
                      flex: 1
                    }}>
                      {task.title}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Badge 
                      count={`${priorityConfig.emoji} ${task.priority.toUpperCase()}`}
                      style={{
                        background: priorityConfig.gradient,
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '9px',
                        borderRadius: '10px',
                        border: 'none'
                      }}
                    />
                    <Text type="secondary" style={{ fontSize: '11px', textTransform: 'capitalize' }}>
                      {typeConfig.emoji} {task.type}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <Paragraph 
              type="secondary" 
              style={{ 
                fontSize: '13px', 
                marginBottom: '12px',
                color: '#595959',
                lineHeight: '1.4'
              }}
              ellipsis={{ rows: 2, expandable: false }}
            >
              {task.description}
            </Paragraph>
          )}

          {/* Footer Section */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: '8px',
            borderTop: '1px solid #f0f0f0'
          }}>
            {/* Assignee and Metadata */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <Tooltip title={task.assignee || 'Unassigned'}>
                <Avatar 
                  size={28}
                  icon={<UserOutlined />}
                  style={{
                    background: typeConfig.bgGradient,
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}
                >
                  {task.assignee ? task.assignee.charAt(0).toUpperCase() : '?'}
                </Avatar>
              </Tooltip>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <ClockCircleOutlined style={{ color: '#8c8c8c', fontSize: '11px' }} />
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    {formatDate(task.updated)}
                  </Text>
                </div>
                <Text type="secondary" style={{ fontSize: '10px' }}>
                  Reporter: {task.reporter || 'Unknown'}
                </Text>
              </div>
            </div>

            {/* Action Buttons */}
            <Space size="small">
              <Tooltip title="Edit backlog item">
                <Button
                  id={`edit-backlog-item-${task.id}`}
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(task)}
                  style={{ 
                    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </Tooltip>
              <Tooltip title="Delete backlog item">
                <Button
                  id={`delete-backlog-item-${task.id}`}
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('Deleting backlog item directly:', task.id);
                    onDelete(task.id);
                  }}
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div 
      id="backlog-view" 
      className="backlog-container scrollable"
      style={{ 
        height: 'calc(100vh - 64px)',
        padding: screenSize === 'mobile' ? '16px' : '24px',
        overflow: 'auto',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100%'
      }}
    >
      {/* Enhanced Header */}
      <div style={{ 
        marginBottom: '32px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background elements */}
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '-20px',
            width: '60px',
            height: '60px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%'
          }} />
          
          <Title level={1} style={{ 
            color: 'white',
            margin: 0,
            fontSize: screenSize === 'mobile' ? '24px' : '32px',
            fontWeight: '800',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1
          }}>
            📚 Product Backlog
          </Title>
          <Text style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '16px',
            position: 'relative',
            zIndex: 1
          }}>
            Manage your product backlog and plan future sprints
          </Text>
          <div style={{ 
            marginTop: '12px',
            position: 'relative',
            zIndex: 1
          }}>
            <Space size="large">
              <Badge 
                count={tasks.length} 
                style={{ backgroundColor: '#52c41a' }}
                size="default"
              />
              <Text style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '14px'
              }}>
                Total Items
              </Text>
              <Text style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '14px',
                background: 'rgba(255,255,255,0.1)',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                Updated: {formatDate(new Date().toISOString())}
              </Text>
            </Space>
          </div>
        </div>
      </div>
      
      {/* Backlog Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sortedTasks.map((task, index) => (
          <BacklogCard key={task.id} task={task} index={index} />
        ))}
        
        {/* Enhanced Empty State */}
        {tasks.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '64px 24px',
            background: 'white',
            borderRadius: '20px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <AlertCircle size={40} style={{ color: 'white' }} />
            </div>
            <Title level={3} style={{ marginBottom: '8px', color: '#595959' }}>
              No Backlog Items Yet
            </Title>
            <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
              Your product backlog is empty.
            </Text>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Create your first backlog item to start planning your sprints!
            </Text>
          </div>
        )}
      </div>
      
      <div style={{ height: '100px' }}></div>
    </div>
  );
};

export default BacklogView;