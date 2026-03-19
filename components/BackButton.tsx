'use client'

interface BackButtonProps {
  isDarkBackground?: boolean
}

/**
 * BackButton Component - Consistent back navigation across all tab pages
 * Style Guide Compliant:
 * - White text on dark background
 * - No arrow character (just "Zurück")
 * - Hover opacity transitions (0.7 on hover, 1.0 default)
 * - Consistent padding & spacing
 * - Accessible aria-label
 */
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
        padding: '0.5rem 1rem',
        marginBottom: '1.5rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: 'opacity 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
      } as React.CSSProperties}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      aria-label="Zurück navigieren"
    >
      Zurück
    </button>
  )
}
