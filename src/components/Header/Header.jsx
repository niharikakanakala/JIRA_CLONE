import React, { useEffect, useState } from 'react';
import { Button, Breadcrumb } from 'antd';
import { PlusOutlined, RocketOutlined } from '@ant-design/icons';
import NotificationsDropdown from '../Notifications/NotificationsDropdown';

const Header = ({ 
  currentView, 
  screenSize, 
  notifications, 
  notificationsOpen,
  onCreateTask,
  onToggleNotifications,
  onRemoveNotification,
  onClearAllNotifications
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll listener for enhanced sticky effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    // Add CSS animations to document head once
    const styleId = 'header-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes drift {
          0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          25% { transform: translateX(20px) translateY(-15px) rotate(90deg); }
          50% { transform: translateX(-10px) translateY(-30px) rotate(180deg); }
          75% { transform: translateX(-25px) translateY(-10px) rotate(270deg); }
          100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
        }
        
        @keyframes wave {
          0% { transform: translateX(-100px) scaleY(1); }
          50% { transform: translateX(0px) scaleY(1.2); }
          100% { transform: translateX(100px) scaleY(1); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1) rotate(0deg); opacity: 0.3; }
          50% { transform: scale(1.1) rotate(180deg); opacity: 0.6; }
          100% { transform: scale(1) rotate(360deg); opacity: 0.3; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-200px) rotate(0deg); }
          100% { transform: translateX(200px) rotate(360deg); }
        }
        
        @keyframes bubble {
          0% { transform: translateY(100px) scale(0); opacity: 0; }
          50% { transform: translateY(50px) scale(1); opacity: 0.8; }
          100% { transform: translateY(0px) scale(0.8); opacity: 0; }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .drift-animation {
          animation: drift 12s linear infinite;
        }
        
        .wave-animation {
          animation: wave 8s ease-in-out infinite;
        }
        
        .pulse-animation {
          animation: pulse 4s ease-in-out infinite;
        }
        
        .shimmer-animation {
          animation: shimmer 6s linear infinite;
        }
        
        .bubble-animation {
          animation: bubble 10s ease-in-out infinite;
        }
        
        .bubble-animation-delay {
          animation: bubble 10s ease-in-out infinite 3s;
        }
        
        .bubble-animation-delay-2 {
          animation: bubble 10s ease-in-out infinite 6s;
        }
        
        .sticky-header {
          position: sticky;
          position: -webkit-sticky; /* Safari support */
          top: 0;
          z-index: 1000;
        }
        
        .sticky-header-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
      `;
      document.head.appendChild(style);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerStyle = {
    background: isScrolled 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderBottom: 'none',
    padding: screenSize === 'mobile' ? '0 12px' : '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    flexShrink: 0,
    boxShadow: isScrolled 
      ? '0 4px 20px rgba(102, 126, 234, 0.25)' 
      : '0 2px 8px rgba(102, 126, 234, 0.15)',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
    width: '100%',
    boxSizing: 'border-box'
  };

  const getViewEmoji = (view) => {
    switch (view) {
      case 'board': return '📋';
      case 'backlog': return '📚';
      case 'reports': return '📊';
      default: return '📋';
    }
  };

  const getViewDisplayName = (view) => {
    switch (view) {
      case 'board': return 'Board';
      case 'backlog': return 'Backlog';
      case 'reports': return 'Reports';
      default: return view;
    }
  };

  return (
    <header 
      id="app-header"
      className="sticky-header"
      style={headerStyle}
    >
      {/* Multiple Animated Background Elements with Light Colors */}
      
      {/* Floating Circles */}
      <div 
        className="float-animation"
        style={{
          position: 'absolute',
          top: '-30%',
          right: '10%',
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(173,216,230,0.2))', // Light blue
          borderRadius: '50%',
          opacity: isScrolled ? 0.4 : 0.7,
          transition: 'opacity 0.3s ease'
        }} 
      />
      
      <div 
        className="drift-animation"
        style={{
          position: 'absolute',
          top: '-40%',
          left: '15%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, rgba(255,182,193,0.2), rgba(255,255,255,0.1))', // Light pink
          borderRadius: '50%',
          opacity: isScrolled ? 0.3 : 0.6,
          transition: 'opacity 0.3s ease'
        }} 
      />

      {/* Wave Elements */}
      <div 
        className="wave-animation"
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '0%',
          width: '200px',
          height: '40px',
          background: 'linear-gradient(90deg, transparent, rgba(152,251,152,0.3), transparent)', // Light green
          borderRadius: '20px',
          opacity: isScrolled ? 0.2 : 0.5,
          transition: 'opacity 0.3s ease'
        }} 
      />

      {/* Pulsing Elements */}
      <div 
        className="pulse-animation"
        style={{
          position: 'absolute',
          top: '20%',
          right: '25%',
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle, rgba(255,255,224,0.3), rgba(255,218,185,0.2))', // Light yellow/peach
          borderRadius: '50%'
        }} 
      />

      <div 
        className="pulse-animation"
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '40px',
          height: '40px',
          background: 'radial-gradient(circle, rgba(230,230,250,0.4), rgba(221,160,221,0.2))', // Light lavender
          borderRadius: '50%',
          animationDelay: '2s'
        }} 
      />

      {/* Shimmer Effect */}
      <div 
        className="shimmer-animation"
        style={{
          position: 'absolute',
          top: '0%',
          left: '0%',
          width: '100px',
          height: '64px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'skew(-20deg)',
          opacity: isScrolled ? 0.3 : 0.6,
          transition: 'opacity 0.3s ease'
        }} 
      />

      {/* Bubble Effects */}
      <div 
        className="bubble-animation"
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '30%',
          width: '25px',
          height: '25px',
          background: 'radial-gradient(circle, rgba(175,238,238,0.4), rgba(240,248,255,0.2))', // Light cyan
          borderRadius: '50%'
        }} 
      />

      <div 
        className="bubble-animation-delay"
        style={{
          position: 'absolute',
          bottom: '-5%',
          left: '50%',
          width: '35px',
          height: '35px',
          background: 'radial-gradient(circle, rgba(255,240,245,0.3), rgba(255,182,193,0.2))', // Light pink
          borderRadius: '50%'
        }} 
      />

      <div 
        className="bubble-animation-delay-2"
        style={{
          position: 'absolute',
          bottom: '0%',
          left: '70%',
          width: '20px',
          height: '20px',
          background: 'radial-gradient(circle, rgba(240,255,240,0.4), rgba(144,238,144,0.2))', // Light green  
          borderRadius: '50%'
        }} 
      />

      {/* Moving Gradient Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(173,216,230,0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255,182,193,0.1) 0%, transparent 50%)
          `,
          animation: 'drift 15s ease-in-out infinite',
          opacity: isScrolled ? 0.5 : 0.8,
          transition: 'opacity 0.3s ease'
        }} 
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '8px',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            transform: isScrolled ? 'scale(0.9)' : 'scale(1)'
          }}>
            <RocketOutlined style={{ 
              color: 'white', 
              fontSize: screenSize === 'mobile' ? '18px' : '22px' 
            }} />
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: screenSize === 'mobile' ? '18px' : isScrolled ? '20px' : '24px',
            fontWeight: '800',
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '0.5px',
            transition: 'font-size 0.3s ease'
          }}>
            JIRA Clone
          </h1>
        </div>
        
        {screenSize === 'mobile' ? (
          <div style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: isScrolled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)',
            padding: '4px 8px',
            borderRadius: '6px',
            backdropFilter: 'blur(10px)',
            transition: 'background 0.3s ease'
          }}>
            <span>{getViewEmoji(currentView)}</span>
            <span>{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</span>
          </div>
        ) : (
          <Breadcrumb
            separator="/"
            style={{ 
              color: 'rgba(255,255,255,0.8)',
              opacity: isScrolled ? 0.9 : 1,
              transition: 'opacity 0.3s ease'
            }}
            items={[
              {
                title: (
                  <span style={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    Project
                  </span>
                )
              },
              {
                title: (
                  <span style={{ 
                    color: 'white', 
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>{getViewEmoji(currentView)}</span>
                    {getViewDisplayName(currentView)}
                  </span>
                )
              }
            ]}
          />
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: screenSize === 'mobile' ? '8px' : '16px',
        zIndex: 1
      }}>
        <NotificationsDropdown
          notifications={notifications}
          onClose={onRemoveNotification}
          onClearAll={onClearAllNotifications}
          isOpen={notificationsOpen}
          onToggle={onToggleNotifications}
        />
        
        <Button
          id="create-task-btn"
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateTask}
          size={screenSize === 'mobile' ? 'middle' : 'large'}
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            height: screenSize === 'mobile' ? '36px' : '40px',
            boxShadow: isScrolled 
              ? '0 6px 16px rgba(79, 172, 254, 0.5)' 
              : '0 4px 12px rgba(79, 172, 254, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = '0 8px 20px rgba(79, 172, 254, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = isScrolled 
              ? '0 6px 16px rgba(79, 172, 254, 0.5)' 
              : '0 4px 12px rgba(79, 172, 254, 0.4)';
          }}
        >
          <span style={{ fontSize: screenSize === 'mobile' ? '12px' : '14px' }}>
            {screenSize === 'mobile' ? 'Create' : 'Create Task'}
          </span>
        </Button>
      </div>
    </header>
  );
};

export default Header;