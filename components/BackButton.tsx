'use client'

interface BackButtonProps {
  isDarkBackground?: boolean
}

export default function BackButton({ isDarkBackground = true }: BackButtonProps) {
  return (
    <button
      onClick={() => window.history.back()}
      style={{
        background: 'transparent',
        border: 'none',
        color: isDarkBackground ? 'white' : '#1e293b',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        padding: '0.5rem 0',
        marginBottom: '1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: 'opacity 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      aria-label="Zurück navigieren"
    >
      <span style={{ fontSize: '1.2rem' }}>←</span> Zurück
    </button>
  )
}
