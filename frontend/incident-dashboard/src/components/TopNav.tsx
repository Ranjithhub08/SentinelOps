'use client';

import { 
  Bell, 
  Search, 
  Settings, 
  HelpCircle,
  Command,
  Zap,
  Globe,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopNav() {
  return (
    <header className="h-20 flex items-center justify-between px-8 mb-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search logs, incidents, or AI insights..."
            className="w-full bg-slate-900/40 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all backdrop-blur-md"
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5">
              <Command className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500">K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all flex items-center space-x-2 px-4 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-xs font-bold uppercase tracking-widest">New Deployment</span>
        </motion.button>

        <div className="flex items-center space-x-2 bg-slate-900/40 border border-white/5 rounded-xl p-1 backdrop-blur-md">
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-slate-900 rounded-full" />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Globe className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="h-8 w-px bg-white/5 mx-2" />

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Live</p>
            <p className="text-xs font-medium text-slate-200">Production API</p>
          </div>
          <div className="p-1 px-2 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center space-x-1 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <Zap className="w-3 h-3 text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black text-indigo-400">92ms</span>
          </div>
        </div>
      </div>
    </header>
  );
}
