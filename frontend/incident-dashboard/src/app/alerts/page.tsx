'use client';

import { motion } from 'framer-motion';
import AlertFeed from '@/components/AlertFeed';
import { Bell, Activity, Clock, Search } from 'lucide-react';

export default function AlertsPage() {
    return (
        <div className="h-full flex flex-col space-y-8 relative overflow-visible">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest text-amber-400">
                            Signal Intelligence
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic">
                        Signal <span className="text-vanta">Stream</span> 
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-2 max-w-md">
                        Real-time heuristic feed of system events and pattern detections.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex items-center space-x-4"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input 
                            type="text" 
                            placeholder="Filter signals..." 
                            className="bg-slate-950/50 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all w-64"
                        />
                    </div>
                    <button className="btn-elite py-2.5">
                        Deep Archives
                    </button>
                </motion.div>
            </div>

            {/* Main Feed Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 min-h-0 relative max-w-4xl"
            >
                <div className="absolute -inset-4 bg-amber-500/[0.01] blur-3xl -z-10 rounded-[3rem]" />
                <AlertFeed />
            </motion.div>
        </div>
    );
}
