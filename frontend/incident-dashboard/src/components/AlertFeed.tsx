'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Terminal, 
  Activity, 
  Cpu, 
  Globe, 
  Database,
  Search,
  Zap,
  Clock,
  ExternalLink
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Alert {
    id: string;
    type: 'system' | 'network' | 'security' | 'database';
    message: string;
    timestamp: string;
    service: string;
    severity: 'info' | 'warning' | 'critical';
}

const mockAlerts: Alert[] = [
    { id: '1', type: 'security', message: 'Potential lateral movement detected in subnet-04', timestamp: '2 mins ago', service: 'Deep-Packet-Inspector', severity: 'critical' },
    { id: '2', type: 'system', message: 'CPU spike on k8s-node-alpha-02', timestamp: '5 mins ago', service: 'Core-Metrics-Collector', severity: 'warning' },
    { id: '3', type: 'network', message: 'DDoS mitigation active on edge-gateway', timestamp: '12 mins ago', service: 'Cloud-WAF', severity: 'info' },
    { id: '4', type: 'database', message: 'Read-replica synchronization delay > 2s', timestamp: '18 mins ago', service: 'DB-Sync-Engine', severity: 'warning' },
    { id: '5', type: 'security', message: 'Root access attempt on jump-server-01', timestamp: '25 mins ago', service: 'IAM-Audit', severity: 'critical' },
];

export default function AlertFeed() {
    const getIcon = (type: string) => {
        switch (type) {
            case 'security': return ShieldAlertIcon;
            case 'system': return Cpu;
            case 'network': return Globe;
            case 'database': return Database;
            default: return Bell;
        }
    };

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            default: return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
        }
    };

    return (
        <div className="glass-elite h-full flex flex-col relative overflow-visible">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Bell className="text-white" size={18} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617] animate-pulse" />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Signal Timeline</h3>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    <Clock size={12} />
                    <span>Live Updates</span>
                </div>
            </div>

            {/* Timeline Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
                {/* Visual Timeline Path */}
                <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/20 via-indigo-500/10 to-transparent" />

                <div className="space-y-8 relative">
                    <AnimatePresence initial={false}>
                        {mockAlerts.map((alert, index) => {
                            const Icon = getIcon(alert.type);
                            return (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative pl-12 group cursor-pointer"
                                >
                                    {/* Timeline Marker */}
                                    <div className="absolute left-[-5px] top-1 z-10">
                                        <div className={cn(
                                            "w-2.5 h-2.5 rounded-full border-2 border-[#020617] group-hover:scale-150 transition-transform duration-500",
                                            alert.severity === 'critical' ? 'bg-rose-500' : 
                                            alert.severity === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
                                        )} />
                                        <div className={cn(
                                            "absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity",
                                            alert.severity === 'critical' ? 'bg-rose-500/40' : 
                                            alert.severity === 'warning' ? 'bg-amber-500/40' : 'bg-indigo-500/40'
                                        )} />
                                    </div>

                                    {/* Alert Card */}
                                    <div className="glass-elite refractive-edge p-5 group-hover:bg-white/[0.05] transition-all duration-500 group-hover:translate-x-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-1.5 bg-slate-950/50 rounded-lg border border-white/5">
                                                    <Icon size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500 group-hover:text-slate-300 transition-colors">
                                                    {alert.service}
                                                </span>
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{alert.timestamp}</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-200 leading-relaxed mb-4">
                                            {alert.message}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className={cn(
                                                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border",
                                                getSeverityStyles(alert.severity)
                                            )}>
                                                {alert.severity}
                                            </div>
                                            <ExternalLink size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-all group-hover:text-indigo-400" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
                <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
                    Access Deep Archives
                </button>
            </div>
        </div>
    );
}

function ShieldAlertIcon({ size, className }: { size: number, className?: string }) {
    return <Zap size={size} className={className} />;
}
