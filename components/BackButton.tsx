'use client'

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      style={{
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        padding: '0.5rem 0',
        marginBottom: '1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      Zurück
    </button>
  )
}
