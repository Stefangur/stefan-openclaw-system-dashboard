'use client'

import { useState, useEffect } from 'react'

interface AuthGateProps {
  onAuthenticated: () => void
  dashboardName: string
}

export default function AuthGate({ onAuthenticated, dashboardName }: AuthGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Check if already authenticated
  useEffect(() => {
    const authToken = localStorage.getItem('stefan_dashboard_auth')
    const authExpiry = localStorage.getItem('stefan_dashboard_auth_expiry')
    
    if (authToken && authExpiry) {
      const expiryTime = parseInt(authExpiry)
      const now = Date.now()
      
      if (now < expiryTime) {
        // Still valid - auto authenticate
        onAuthenticated()
        return
      } else {
        // Expired - clear storage
        localStorage.removeItem('stefan_dashboard_auth')
        localStorage.removeItem('stefan_dashboard_auth_expiry')
      }
    }
  }, [onAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Stefan's dashboard password
      const correctPassword = 'sgu2026!'
      
      // Simulate network delay for UX
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (password === correctPassword) {
        // Set auth token with 24h expiry
        const authToken = 'authenticated'
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        
        localStorage.setItem('stefan_dashboard_auth', authToken)
        localStorage.setItem('stefan_dashboard_auth_expiry', expiryTime.toString())
        
        onAuthenticated()
      } else {
        setError('Ungültiges Passwort')
        setPassword('')
      }
    } catch (err) {
      setError('Login-Fehler aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '3rem',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px',
        color: 'white'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 'bold' }}>
            Dashboard Login
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem' }}>
            {dashboardName}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Dashboard-Passwort eingeben"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              background: isLoading || !password.trim() 
                ? 'rgba(156, 163, 175, 0.3)'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: isLoading || !password.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              minHeight: '80px'
            }}
          >
            {isLoading ? 'Anmeldung...' : '🔓 Dashboard entsperren'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.8rem'
        }}>
          🔒 Sitzung bleibt 24h aktiv • 📱 Mobile-optimiert
        </div>
      </div>
    </div>
  )
}