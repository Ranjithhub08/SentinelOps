'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Server, Activity, AlertCircle, FileText, Bot, BrainCircuit, ExternalLink, Shield } from 'lucide-react';
import { Incident } from './IncidentTable';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function IncidentDetailsPanel({ incidentId, onClose }: { incidentId: string, onClose: () => void, incidents: Incident[] }) {
    const [incident, setIncident] = useState<Incident | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDetails() {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8004/incidents/${incidentId}`);
                if (res.ok) {
                    const data = await res.json();
                    const mockedEnrichedData = {
                        ...data,
                        root_cause: data.type === 'HIGH_CPU' ? 'Resource Saturation' :
                            data.type === 'HIGH_LATENCY' ? 'Downstream Service Congestion' :
                                'Cluster Node Instability',
                        explanation: data.type === 'HIGH_CPU' ? 'Core processing units reached 98% utilization, leading to thread contention across the main worker pool.' :
                            'Response times deviated from the 99th percentile baseline, suggesting a bottleneck in the database connector.',
                        suggested_action: data.type === 'HIGH_CPU' ? 'Initiate vertical scaling or deploy secondary worker nodes to shard the current load.' :
                            'Drain the affected node and inspect the connection pool configuration for the secondary database cluster.',
                    };
                    setIncident(mockedEnrichedData);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadDetails();
    }, [incidentId]);

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    if (loading) return (
        <div className="glass-panel h-full flex flex-col items-center justify-center space-y-4">
            <Activity className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 shimmer">Synchronizing Telemetry...</p>
        </div>
    );
    
    if (!incident) return (
        <div className="glass-panel h-full flex items-center justify-center">
            <p className="text-xs font-black uppercase tracking-widest text-rose-500">Telemetry Lost</p>
        </div>
    );

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="glass-panel h-full flex flex-col relative overflow-hidden bg-slate-950/40 border-white/5"
        >
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-transparent to-rose-500 opacity-30" />
            
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-all z-20 group"
            >
                <X className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>

            <div className="p-8 pb-6 relative z-10">
                <motion.div variants={itemVariants} className="flex flex-col">
                    <div className="flex items-center space-x-3 mb-2">
                        <Shield className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Incident Intel</h2>
                    </div>
                    <p className="text-[10px] font-black font-mono text-slate-500 tracking-widest uppercase">Node: {incident.incident_id.substring(0, 12)}</p>
                </motion.div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 space-y-8 pb-8 custom-scrollbar relative z-10">
                {/* Core Stats */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Server className="w-3 h-3" /> Target</p>
                        <p className="text-sm font-bold text-slate-200">{incident.service}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Activity className="w-3 h-3" /> Classification</p>
                        <p className="text-sm font-bold text-slate-200">{incident.type}</p>
                    </div>
                </motion.div>

                {/* AI Analysis Block */}
                <motion.div 
                    variants={itemVariants}
                    className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 relative overflow-hidden overflow-visible"
                >
                    <div className="absolute -top-10 -right-10 opacity-[0.05] pointer-events-none">
                        <BrainCircuit className="w-48 h-48" />
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                            <Bot className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">AI Deep Analysis</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-indigo-400/50 uppercase tracking-widest mb-2">Inferred Root Cause</p>
                            <p className="text-base font-black text-white tracking-tight">{incident.root_cause || "Analyzing Data Core..."}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-400/50 uppercase tracking-widest mb-2">Technical Insight</p>
                            <p className="text-xs leading-relaxed text-slate-400 font-medium italic">"{incident.explanation}"</p>
                        </div>
                    </div>
                </motion.div>

                {/* Remediation */}
                <motion.div 
                    variants={itemVariants}
                    className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20"
                >
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <FileText className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Recommended Action</h3>
                    </div>
                    
                    <p className="text-xs text-slate-300 leading-relaxed font-medium mb-6">
                        {incident.suggested_action}
                    </p>
                    
                    <button className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                        Execute Automated Runbook <ExternalLink className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}
