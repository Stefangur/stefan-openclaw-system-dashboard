import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stefan\'s Fitness Dashboard v2.0 💪',
  description: 'Enhanced fitness tracking with AI-assisted features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body 
        style={{
          margin: 0,
          padding: 0,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
          color: '#f1f5f9',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          minHeight: '100vh'
        }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        {children}
      </body>
    </html>
  )
}