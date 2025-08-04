import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, Typography, Empty, Statistic, Badge } from 'antd';
import { TrophyOutlined, RocketOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { AlertCircle } from 'lucide-react';
import { STATUS_COLUMNS, TYPE_ICONS, PRIORITY_COLORS } from '../../utils/constants';
import { formatDate, sortTasksByDate, calculatePercentage } from '../../utils/helpers';

const { Title, Text } = Typography;

const ReportsView = ({ allTasks, screenSize }) => {
  const [animatedCounts, setAnimatedCounts] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  
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

  const recentTasks = sortTasksByDate(allTasks, 'updated', 'desc').slice(0, 12);
  const totalTasks = allTasks.length;

  // Animate counters on mount
  useEffect(() => {
    const counts = {
      total: totalTasks,
      completed: statusCounts.done || 0,
      progress: statusCounts.progress || 0,
      backlog: backlogTasks.length
    };
    
    // Animate each counter
    Object.keys(counts).forEach(key => {
      let start = 0;
      const end = counts[key];
      const duration = 1500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedCounts(prev => ({ ...prev, [key]: end }));
          clearInterval(timer);
        } else {
          setAnimatedCounts(prev => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 16);
    });
  }, [totalTasks, statusCounts.done, statusCounts.progress, backlogTasks.length]);

  const getProgressColor = (type) => {
    switch (type) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#1890ff';
    }
  };

  const getStatCardConfig = (type) => {
    switch (type) {
      case 'total':
        return {
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          icon: <TeamOutlined />,
          color: '#667eea'
        };
      case 'completed':
        return {
          gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          icon: <TrophyOutlined />,
          color: '#43e97b'
        };
      case 'progress':
        return {
          gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          icon: <RocketOutlined />,
          color: '#fa709a'
        };
      case 'backlog':
        return {
          gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          icon: <ClockCircleOutlined />,
          color: '#a8edea'
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          icon: <TeamOutlined />,
          color: '#667eea'
        };
    }
  };

  const StatCard = ({ title, value, type, index }) => {
    const config = getStatCardConfig(type);
    const isHovered = hoveredCard === `stat-${index}`;
    
    return (
      <Card
        style={{
          background: isHovered 
            ? `linear-gradient(135deg, ${config.color}10, ${config.color}05)`
            : 'white',
          border: `1px solid ${isHovered ? config.color + '40' : '#f0f0f0'}`,
          borderRadius: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'none',
          boxShadow: isHovered 
            ? `0 8px 25px ${config.color}20, 0 0 0 1px ${config.color}30`
            : '0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onMouseEnter={() => setHoveredCard(`stat-${index}`)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Animated background pattern */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: config.gradient,
          borderRadius: '50%',
          opacity: 0.1,
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.2)' : 'scale(1)'
        }} />
        
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            background: config.gradient,
            borderRadius: '12px',
            padding: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}>
            {React.cloneElement(config.icon, { 
              style: { color: 'white', fontSize: '24px' } 
            })}
          </div>
          <Statistic
            value={animatedCounts[type] || 0}
            valueStyle={{
              fontSize: screenSize === 'mobile' ? '28px' : '36px',
              fontWeight: 'bold',
              background: config.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          />
          <Text type="secondary" style={{ fontSize: '14px', fontWeight: '500' }}>
            {title}
          </Text>
        </div>
      </Card>
    );
  };

  const ProgressCard = ({ title, data, colorGetter, iconGetter }) => {
    return (
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>📊</span>
            </div>
            <span style={{ fontWeight: '600', fontSize: '16px' }}>{title}</span>
          </div>
        }
        style={{
          borderRadius: '16px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '24px'
        }}
        styles={{ padding: '20px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {data.map(([key, count]) => {
            const percentage = calculatePercentage(count, 
              title.includes('Priority') ? totalTasks : boardTasks.length
            );
            const color = colorGetter ? colorGetter(key) : '#1890ff';
            
            return (
              <div key={key} style={{ position: 'relative' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {iconGetter && iconGetter(key)}
                    <Text style={{ 
                      fontWeight: '500',
                      textTransform: 'capitalize',
                      fontSize: '14px'
                    }}>
                      {key === 'progress' ? 'In Progress' : 
                       key === 'review' ? 'In Review' :
                       key === 'todo' ? 'To Do' :
                       key === 'done' ? 'Done' : `${key} Priority`}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge 
                      count={count} 
                      style={{ 
                        backgroundColor: color,
                        color: 'white',
                        fontWeight: '600'
                      }} 
                    />
                    <Text type="secondary" style={{ fontSize: '12px', minWidth: '40px' }}>
                      {percentage}%
                    </Text>
                  </div>
                </div>
                <Progress 
                  percent={percentage} 
                  showInfo={false}
                  strokeColor={{
                    '0%': color,
                    '100%': color + '80'
                  }}
                  trailColor="#f0f0f0"
                  strokeWidth={8}
                  style={{
                    marginBottom: '4px'
                  }}
                />
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div 
      id="reports-view" 
      className="reports-container scrollable"
      style={{ 
        height: 'calc(100vh - 64px)',
        padding: screenSize === 'mobile' ? '16px' : '24px',
        overflow: 'auto',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100%'
      }}
    >
      {/* Header Section */}
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
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
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
            📊 Project Analytics
          </Title>
          <Text style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '16px',
            position: 'relative',
            zIndex: 1
          }}>
            Track your project progress and team performance
          </Text>
          <div style={{ 
            marginTop: '12px',
            position: 'relative',
            zIndex: 1
          }}>
            <Text style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '14px',
              background: 'rgba(255,255,255,0.1)',
              padding: '4px 12px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              Total: {totalTasks} tasks | Active: {boardTasks.length} | Backlog: {backlogTasks.length}
            </Text>
          </div>
        </div>
      </div>

      {/* Animated Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={12} sm={6}>
          <StatCard title="Total Tasks" value={totalTasks} type="total" index={0} />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Completed" value={statusCounts.done || 0} type="completed" index={1} />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="In Progress" value={statusCounts.progress || 0} type="progress" index={2} />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Backlog Items" value={backlogTasks.length} type="backlog" index={3} />
        </Col>
      </Row>

      {/* Enhanced Progress Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <ProgressCard
            title="Status Distribution"
            data={STATUS_COLUMNS.map(col => [col.key, statusCounts[col.key] || 0])}
            colorGetter={(status) => {
              switch (status) {
                case 'todo': return '#667eea';
                case 'progress': return '#fa709a';
                case 'review': return '#4facfe';
                case 'done': return '#43e97b';
                default: return '#667eea';
              }
            }}
          />
        </Col>
        <Col xs={24} lg={12}>
          <ProgressCard
            title="Priority Distribution"
            data={Object.entries(priorityCounts)}
            colorGetter={getProgressColor}
          />
        </Col>
      </Row>

      {/* Task Types with Icons */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>📝</span>
            </div>
            <span style={{ fontWeight: '600', fontSize: '16px' }}>Task Types Distribution</span>
          </div>
        }
        style={{
          borderRadius: '16px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '32px'
        }}
        styles={{ padding: '20px' }}
      >
        <Row gutter={[16, 16]}>
          {Object.keys(TYPE_ICONS).map(type => {
            const count = allTasks.filter(task => task.type === type).length;
            const percentage = calculatePercentage(count, totalTasks);
            const IconComponent = TYPE_ICONS[type];
            const typeColors = {
              story: '#00d2d3',
              bug: '#ff5722',
              task: '#2196f3',
              feature: '#9c27b0'
            };
            
            return (
              <Col xs={12} sm={6} key={type}>
                <div style={{
                  background: 'white',
                  border: `1px solid ${typeColors[type]}20`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${typeColors[type]}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{
                    background: `linear-gradient(135deg, ${typeColors[type]}, ${typeColors[type]}80)`,
                    borderRadius: '10px',
                    padding: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px'
                  }}>
                    <IconComponent size={20} style={{ color: 'white' }} />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: typeColors[type] }}>
                    {count}
                  </div>
                  <Text style={{ textTransform: 'capitalize', fontSize: '12px' }}>
                    {type}
                  </Text>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Enhanced Recent Activity */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ClockCircleOutlined style={{ color: 'white', fontSize: '14px' }} />
            </div>
            <span style={{ fontWeight: '600', fontSize: '16px' }}>Recent Activity</span>
          </div>
        }
        style={{
          borderRadius: '16px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '100px'
        }}
        styles={{ padding: '20px' }}
      >
        {recentTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTasks.map((task, index) => {
              const IconComponent = TYPE_ICONS[task.type];
              const priorityColor = task.priority === 'high' ? '#ff4d4f' : 
                                  task.priority === 'medium' ? '#faad14' : '#52c41a';
              const typeColors = {
                story: '#00d2d3',
                bug: '#ff5722',
                task: '#2196f3',
                feature: '#9c27b0'
              };
              
              return (
                <div 
                  key={task.id}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                    transition: 'all 0.3s ease',
                    animation: `slideIn 0.3s ease ${index * 0.1}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{
                      background: `linear-gradient(135deg, ${typeColors[task.type]}, ${typeColors[task.type]}80)`,
                      borderRadius: '8px',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={14} style={{ color: 'white' }} />
                    </div>
                    <Text ellipsis style={{ flex: 1, fontWeight: '500' }}>
                      {task.title}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Badge 
                      color={priorityColor}
                      text={
                        <span style={{ 
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {task.priority}
                        </span>
                      }
                    />
                    <Text type="secondary" style={{ fontSize: '12px', minWidth: '60px' }}>
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
            description={
              <div>
                <Text type="secondary">No recent activity found.</Text>
                <br />
                <Text type="secondary">Start creating tasks to see activity here!</Text>
              </div>
            }
          />
        )}
      </Card>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes slideIn {
          from { 
            transform: translateX(-20px); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  );
};

export default ReportsView;