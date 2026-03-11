'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, AlertCircle, Bell, BrainCircuit, ShieldAlert, Cpu, Activity } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const inter = Inter({ subsets: ['latin'] })

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/incidents', label: 'Incidents', icon: AlertCircle },
    { href: '/alerts', label: 'Alert Feed', icon: Bell },
    { href: '/insights', label: 'AI Insights', icon: BrainCircuit },
  ]

  return (
    <html lang="en" className="dark">
      <head>
        <title>SentinelOps | AI-Powered Monitor</title>
      </head>
      <body className={cn(inter.className, "flex h-screen overflow-hidden bg-mesh")}>
        {/* Sidebar Navigation */}
        <motion.aside 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="w-72 border-r border-white/5 flex flex-col glass-panel m-4 mr-0 rounded-2xl relative overflow-hidden group"
        >
          {/* Brand */}
          <div className="p-8 flex items-center space-x-3">
            <div className="relative">
              <ShieldAlert className="w-10 h-10 text-indigo-500 glow-text" />
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-gradient">
                SENTINEL
              </h1>
              <p className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">Operations</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "nav-item group/item",
                    isActive && "active"
                  )}>
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform duration-300 group-hover/item:scale-110",
                      isActive ? "text-indigo-400" : "text-slate-500"
                    )} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="nav-active"
                        className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                      />
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer Info */}
          <div className="p-6 border-t border-white/5 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
              </div>
              <Activity className="w-4 h-4 text-emerald-500/50" />
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/50 border border-white/5">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Cpu className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Core Load</p>
                <p className="text-xs font-bold text-slate-200">12.4%</p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden p-4">
          <AnimatePresence mode="wait">
            <motion.div 
              key={pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel w-full h-full p-8 overflow-y-auto relative"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[100px] -z-10 rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-500/5 blur-[80px] -z-10 rounded-full pointer-events-none" />
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </body>
    </html>
  )
}
