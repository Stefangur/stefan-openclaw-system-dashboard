import React, { useState } from 'react';

interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
  loading?: boolean;
  lastUpdate?: Date;
  icon?: string;
  label?: string;
  position?: 'fixed' | 'inline';
  size?: 'small' | 'medium' | 'large';
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  loading = false,
  lastUpdate = new Date(),
  icon = '🔄',
  label = 'Aktualisieren',
  position = 'fixed',
  size = 'medium'
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small': return { width: '50px', height: '50px', fontSize: '20px' };
      case 'large': return { width: '100px', height: '100px', fontSize: '40px' };
      default: return { width: '80px', height: '80px', fontSize: '32px' };
    }
  };

  const buttonStyle = {
    ...getSizeStyles(),
    borderRadius: '50%',
    background: isRefreshing 
      ? 'rgba(251, 191, 36, 0.9)' 
      : 'rgba(34, 197, 94, 0.9)',
    border: 'none',
    color: 'white',
    cursor: isRefreshing ? 'not-allowed' : 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)',
    transition: 'all 0.5s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isRefreshing ? 0.7 : 1,
    ...(position === 'fixed' ? {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    } : {})
  };

  const containerStyle = position === 'fixed' ? {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center'
  } : {
    display: 'inline-flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    margin: '1rem'
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={handleClick}
        disabled={isRefreshing}
        style={buttonStyle}
        title={isRefreshing ? 'Aktualisiert...' : label}
      >
        {isRefreshing ? '⏳' : icon}
      </button>
      
      <div style={{
        fontSize: '0.7rem',
        textAlign: 'center',
        marginTop: '0.5rem',
        color: 'rgba(255,255,255,0.7)',
        background: 'rgba(0,0,0,0.3)',
        padding: '0.25rem 0.5rem',
        borderRadius: '12px',
        whiteSpace: 'nowrap'
      }}>
        {isRefreshing ? (
          'Lädt...'
        ) : (
          <>
            <div>{new Date(lastUpdate).toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
            {position === 'fixed' && (
              <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>
                {label}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RefreshButton;