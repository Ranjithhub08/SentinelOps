'use client';

import { motion } from 'framer-motion';
import IncidentTable from '@/components/IncidentTable';
import { ShieldAlert, Terminal, Filter, Download } from 'lucide-react';

export default function IncidentsPage() {
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
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] font-black uppercase tracking-widest text-rose-400">
                            High Priority Queue
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic">
                        Incident <span className="text-vanta">Unit</span> 
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-2 max-w-md">
                        Advanced classification and triage of detected security anomalies.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex items-center space-x-3"
                >
                    <button className="p-3 rounded-2xl glass-elite border-white/5 hover:bg-white/[0.05] transition-all group">
                        <Filter className="text-slate-400 group-hover:text-white" size={18} />
                    </button>
                    <button className="btn-elite flex items-center space-x-3">
                        <Download size={14} />
                        <span>Export Logs</span>
                    </button>
                </motion.div>
            </div>

            {/* Main Table Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 min-h-0 relative"
            >
                <div className="absolute -inset-4 bg-indigo-500/[0.02] blur-3xl -z-10 rounded-[3rem]" />
                <IncidentTable />
            </motion.div>
        </div>
    );
}
