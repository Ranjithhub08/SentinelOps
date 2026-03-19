'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ShieldQuestion, 
  ChevronRight, 
  Activity, 
  Lock,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface Incident {
    id: string;
    title: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'active' | 'resolved' | 'investigating';
    timestamp: string;
    source: string;
}

const mockIncidents: Incident[] = [
    { id: 'INC-2024-001', title: 'Suspicious credential spray detected', severity: 'critical', status: 'active', timestamp: '2024-03-13T10:15:00Z', source: 'auth-gateway-01' },
    { id: 'INC-2024-002', title: 'Unauthorized API access attempt', severity: 'high', status: 'investigating', timestamp: '2024-03-13T09:42:00Z', source: 'api-lb-prod' },
    { id: 'INC-2024-003', title: 'Abnormal egress traffic volume', severity: 'medium', status: 'resolved', timestamp: '2024-03-13T08:21:00Z', source: 'vpc-flow-logs' },
    { id: 'INC-2024-004', title: 'Potential SQL injection pattern', severity: 'critical', status: 'active', timestamp: '2024-03-13T07:15:00Z', source: 'waf-edge-02' },
];

export default function IncidentTable({ incidents = mockIncidents }: { incidents?: any[] }) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'high': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'medium': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="glass-elite h-full flex flex-col relative overflow-visible">
            {/* Table Header / Toolbar */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search incidents..." 
                            className="bg-slate-950/50 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all w-64"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-slate-400">
                        <Filter size={14} />
                    </button>
                    <button className="btn-elite py-2">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-separate border-spacing-y-2 px-6 pb-6">
                    <thead className="sticky top-0 bg-[#020617]/80 backdrop-blur-md z-20">
                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            <th className="py-4 pl-4">Incident</th>
                            <th className="py-4">Severity</th>
                            <th className="py-4">Status</th>
                            <th className="py-4">Source</th>
                            <th className="py-4 pr-4 text-right">Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence initial={false}>
                            {incidents.slice(0, 20).map((rawIncident, index) => {
                                const incident = {
                                    id: rawIncident.incident_id || rawIncident.id,
                                    title: rawIncident.type || rawIncident.title,
                                    severity: (rawIncident.severity || 'low').toLowerCase(),
                                    status: (rawIncident.status || 'investigating').toLowerCase(),
                                    timestamp: rawIncident.timestamp,
                                    source: rawIncident.service || rawIncident.source,
                                };
                                return (
                                <motion.tr
                                    key={incident.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={() => setSelectedId(selectedId === incident.id ? null : incident.id)}
                                    className={cn(
                                        "group cursor-pointer relative transition-all duration-500",
                                        selectedId === incident.id ? "bg-indigo-500/5 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]" : "hover:bg-white/[0.02]"
                                    )}
                                >
                                    <td className="py-4 pl-4 rounded-l-2xl border-l border-y border-white/5 group-hover:border-white/10 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">
                                                {incident.title}
                                            </span>
                                            <span 
                                                className="text-[10px] font-bold text-slate-600 mt-0.5"
                                                suppressHydrationWarning
                                            >
                                                {incident.id} • {new Date(incident.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 border-y border-white/5 group-hover:border-white/10 transition-colors">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border",
                                            getSeverityStyles(incident.severity)
                                        )}>
                                            {incident.severity}
                                        </span>
                                    </td>
                                    <td className="py-4 border-y border-white/5 group-hover:border-white/10 transition-colors">
                                        <div className="flex items-center space-x-2">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full animate-pulse",
                                                incident.status === 'active' ? 'bg-rose-500' : 
                                                incident.status === 'investigating' ? 'bg-amber-500' : 'bg-emerald-500'
                                            )} />
                                            <span className="text-[10px] font-bold text-slate-400 capitalize">
                                                {incident.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 border-y border-white/5 group-hover:border-white/10 transition-colors">
                                        <div className="flex items-center space-x-2 text-slate-500 group-hover:text-slate-300 transition-colors">
                                            <Activity size={12} />
                                            <span className="text-[10px] font-bold uppercase tracking-tight">{incident.source}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 rounded-r-2xl border-r border-y border-white/5 group-hover:border-white/10 transition-colors text-right">
                                        <div className="flex items-center justify-end space-x-3">
                                            <div className="h-6 w-24 bg-white/5 rounded-full overflow-hidden relative group-hover:bg-white/10 transition-colors">
                                                <div className="absolute inset-y-0 left-0 bg-indigo-500/30 w-1/2 group-hover:w-3/4 transition-all duration-1000" />
                                            </div>
                                            <ArrowUpRight size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                        </div>
                                    </td>
                                </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Detailed Overlay (Holographic Panel) */}
            <AnimatePresence>
                {selectedId && (() => {
                    const rawIncident = incidents.find(i => (i.incident_id || i.id) === selectedId);
                    if (!rawIncident) return null;
                    
                    const title = rawIncident.type || rawIncident.title;
                    const rootCause = rawIncident.root_cause || "Analyzing...";
                    const explanation = rawIncident.explanation || "System is currently performing deep heuristic analysis on this anomaly event. Resolution patterns will appear shortly.";
                    const action = rawIncident.suggested_action || "Awaiting AI triage...";

                    return (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", bounce: 0.3 }}
                            className="absolute bottom-8 right-8 w-96 glass-elite refractive-edge p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 border-indigo-500/20"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-400/30">
                                    <ShieldAlert className="text-indigo-400" size={18} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Root Cause</span>
                                    <span className="text-[11px] font-bold text-white mt-1 uppercase tracking-tighter italic">{rootCause}</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedId(null)}
                                    className="text-slate-500 hover:text-white transition-colors"
                                >
                                    <ChevronRight className="rotate-90 md:rotate-0" size={18} />
                                </button>
                            </div>
                            <h4 className="text-sm font-black text-white mb-2 uppercase tracking-wide italic">{title}</h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                                {explanation}
                            </p>
                            <div className="space-y-3">
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 mb-4">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1 underline decoration-indigo-500/50">Next Best Action</span>
                                    <span className="text-[11px] font-bold text-indigo-300 italic">
                                        {action}
                                    </span>
                                </div>
                                <button className="btn-elite w-full py-3 !bg-rose-500/10 !border-rose-500/30 !text-rose-500 hover:!bg-rose-500/20 transition-all">
                                    Initiate Countermeasures
                                </button>
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
}
