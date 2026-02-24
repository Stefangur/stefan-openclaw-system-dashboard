import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Stefan's OpenClaw Dashboard 🤖",
  description: 'OpenClaw System Status',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
