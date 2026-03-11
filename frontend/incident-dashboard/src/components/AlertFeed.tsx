'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, Bell, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AlertMessage {
    id: string;
    message: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    timestamp: string;
}

export default function AlertFeed() {
    const [alerts, setAlerts] = useState<AlertMessage[]>([]);

    useEffect(() => {
        const defaultAlerts: AlertMessage[] = [
            { id: '1', message: 'High CPU threshold exceeded on payment-api', type: 'critical', timestamp: new Date(Date.now() - 50000).toISOString() },
            { id: '2', message: 'Database latency returned to normal', type: 'success', timestamp: new Date(Date.now() - 300000).toISOString() },
            { id: '3', message: 'Spike in error rates detected on auth-service', type: 'warning', timestamp: new Date(Date.now() - 1200000).toISOString() }
        ];
        setAlerts(defaultAlerts);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'critical': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'critical': return 'bg-rose-500/10 border-rose-500/20';
            case 'warning': return 'bg-amber-500/10 border-amber-500/20';
            case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
            default: return 'bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <div className="glass-panel h-full flex flex-col bg-slate-950/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-700" />
            
            <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Bell size={18} className="text-slate-400" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                    </div>
                    <h3 className="font-black text-sm uppercase tracking-[0.15em] text-white">Live Alert Feed</h3>
                </div>
                <Activity className="w-4 h-4 text-slate-600 animate-pulse" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {alerts.map((alert, index) => (
                        <motion.div 
                            key={alert.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5, ease: "circOut" }}
                            className={cn(
                                "flex gap-4 items-start p-4 rounded-2xl border transition-all duration-300 hover:bg-white/[0.04] hover:scale-[1.02] cursor-pointer",
                                getTypeColor(alert.type)
                            )}
                        >
                            <div className="mt-0.5 p-2 rounded-xl bg-slate-900/50 shadow-inner">
                                {getIcon(alert.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-100 leading-relaxed mb-2">{alert.message}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", 
                                            alert.type === 'critical' ? 'bg-rose-500' : 
                                            alert.type === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
                                        )} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{alert.type}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-600">
                                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {alerts.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <ShieldAlert className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest text-slate-600">No active alerts</p>
                    </motion.div>
                )}
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                <button className="w-full py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all active:scale-95">
                    View Alert History
                </button>
            </div>
        </div>
    );
}
