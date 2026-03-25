'use client'

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      style={{
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '0.95rem',
        fontWeight: 500,
        cursor: 'pointer',
        padding: '0',
        marginBottom: '1.5rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
    >
      ← Zurück
    </button>
  )
}
