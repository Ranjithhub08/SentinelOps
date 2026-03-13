'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  ShieldAlert, 
  Bell, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  Zap,
  Activity,
  Layers,
  Fingerprint
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/' },
  { icon: ShieldAlert, label: 'Incidents', href: '/incidents' },
  { icon: Bell, label: 'Alert Feed', href: '/alerts' },
  { icon: BarChart3, label: 'Insights', href: '/insights' },
  { icon: Layers, label: 'Infrastructure', href: '/infra' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 100 : 280 }}
      className="h-full py-6 pr-4 flex flex-col relative z-50 overflow-visible"
    >
      <div className="glass-elite h-full flex flex-col relative overflow-visible group/sidebar">
        {/* Animated Background Pulse */}
        <div className="absolute -inset-[1px] bg-gradient-to-b from-indigo-500/10 via-transparent to-purple-500/10 rounded-[inherit] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        
        {/* Header / Logo */}
        <div className="p-8 pb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group/logo">
            <div className="relative">
              <div className="p-2.5 bg-indigo-500/20 rounded-2xl border border-indigo-400/30 group-hover/logo:scale-110 group-hover/logo:rotate-3 transition-all duration-500">
                <Fingerprint className="text-indigo-400 group-hover/logo:text-white transition-colors" size={24} />
              </div>
              <div className="absolute -inset-2 bg-indigo-500/20 blur-xl opacity-0 group-hover/logo:opacity-100 transition-opacity" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-xl font-black tracking-tighter text-vanta">SENTINEL</span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400/60 -mt-1">Operational</span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "nav-item-elite group relative",
                  isActive && "active",
                  isCollapsed && "px-0 justify-center"
                )}>
                  <div className={cn(
                    "relative z-10 transition-transform duration-500 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-200"
                  )}>
                    <item.icon size={20} className={cn(
                        "transition-all",
                        isActive && "drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                    )} />
                  </div>
                  {!isCollapsed && (
                    <span className="relative z-10 text-sm tracking-wide">
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white/[0.05] rounded-2xl border border-white/5 shadow-2xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-6 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Status */}
        <div className="p-6 border-t border-white/5">
            <div className={cn(
                "glass-elite p-4 !rounded-2xl border-white/5 flex items-center gap-4 group/status cursor-pointer",
                isCollapsed && "p-3 justify-center"
            )}>
                <div className="relative shrink-0">
                    <Activity size={16} className="text-emerald-500" />
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-500">System High</span>
                        <span className="text-[10px] font-bold text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">Node 04-Global</span>
                    </div>
                )}
            </div>
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass-elite flex items-center justify-center hover:scale-110 transition-all border border-white/10 shadow-2xl z-[60]"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </motion.div>
  );
}
