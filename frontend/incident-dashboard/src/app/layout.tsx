import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { LayoutDashboard, AlertCircle, Bell, BrainCircuit, ShieldAlert } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SentinelOps Dashboard',
  description: 'AI-powered Incident Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-slate-950 text-slate-50`}>
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-800 flex flex-col glass-panel m-4 mr-0 rounded-r-none border-r-0">
          <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
            <ShieldAlert className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              SentinelOps
            </h1>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link href="/" className="nav-item">
              <LayoutDashboard className="w-5 h-5" />
              <span>Overview</span>
            </Link>
            <Link href="/incidents" className="nav-item">
              <AlertCircle className="w-5 h-5" />
              <span>Incidents</span>
            </Link>
            <Link href="/alerts" className="nav-item">
              <Bell className="w-5 h-5" />
              <span>Alert Feed</span>
            </Link>
            <Link href="/insights" className="nav-item">
              <BrainCircuit className="w-5 h-5" />
              <span>AI Insights</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
            v1.0.0-beta
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden p-4">
          <div className="glass-panel w-full h-full p-6 overflow-y-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
