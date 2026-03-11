'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Shield, ShieldQuestion, Search, Filter, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import IncidentDetailsPanel from './IncidentDetailsPanel';

import { MOCK_INCIDENTS } from './mockData';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface Incident {
    incident_id: string;
    service: string;
    type: string;
    severity: string;
    status: string;
    timestamp: string;
    root_cause?: string;
    explanation?: string;
    suggested_action?: string;
}

export default function IncidentTable() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchIncidents() {
            const apiUrl = process.env.NEXT_PUBLIC_INCIDENT_API_URL || 'http://localhost:8004';
            try {
                const response = await fetch(`${apiUrl}/incidents`);
                if (response.ok) {
                    const data = await response.json();
                    setIncidents(data);
                } else if (!process.env.NEXT_PUBLIC_INCIDENT_API_URL) {
                    // Fallback to mock data if local backend is down and no prod URL provided
                    setIncidents(MOCK_INCIDENTS);
                }
            } catch (error) {
                console.error('Failed to fetch incidents', error);
                if (!process.env.NEXT_PUBLIC_INCIDENT_API_URL) {
                    setIncidents(MOCK_INCIDENTS);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchIncidents();
        const interval = setInterval(fetchIncidents, 10000); // Polling
        return () => clearInterval(interval);
    }, []);

    const getSeverityBadge = (severity: string) => {
        const base = "px-2.5 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 w-max";
        switch (severity.toUpperCase()) {
            case 'CRITICAL': return <span className={cn(base, "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]")}><ShieldAlert className="w-3 h-3 animate-pulse" /> CRITICAL</span>;
            case 'HIGH': return <span className={cn(base, "bg-orange-500/10 text-orange-500 border-orange-500/20")}><ShieldAlert className="w-3 h-3" /> HIGH</span>;
            case 'MEDIUM': return <span className={cn(base, "bg-amber-500/10 text-amber-500 border-amber-500/20")}><Shield className="w-3 h-3" /> MEDIUM</span>;
            default: return <span className={cn(base, "bg-indigo-500/10 text-indigo-500 border-indigo-500/20")}><ShieldCheck className="w-3 h-3" /> LOW</span>;
        }
    };

    return (
        <div className="flex gap-8 h-full">
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-700 ease-in-out h-full overflow-hidden",
                selectedIncidentId ? 'hidden lg:flex lg:w-1/2' : 'w-full'
            )}>
                {/* Header */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-xl font-black text-white tracking-tight">System Events</h3>
                        {!loading && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase text-indigo-400"
                            >
                                {incidents.length} Detected
                            </motion.div>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <div className="relative group/search">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/search:text-indigo-400 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Filter by ID or Service..." 
                                className="bg-slate-900/40 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-48 focus:w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Table container */}
                <div className="flex-1 overflow-auto px-4 pb-4">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead className="sticky top-0 bg-[#020617]/80 backdrop-blur-md z-10">
                            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Status / Severity</th>
                                <th className="px-6 py-4 text-right">Detection Time</th>
                            </tr>
                        </thead>
                        <tbody className="space-y-4">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <div className="flex flex-col items-center space-y-4">
                                            <Activity className="w-8 h-8 text-indigo-500/50 animate-spin" />
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest shimmer">Synchronizing events...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : incidents.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <div className="flex flex-col items-center space-y-2 opacity-50">
                                            <ShieldCheck className="w-12 h-12 text-emerald-500/30" />
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No Active Threats Detected</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {incidents.map((inc, index) => (
                                        <motion.tr
                                            key={inc.incident_id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05, duration: 0.5, ease: "circOut" }}
                                            onClick={() => setSelectedIncidentId(inc.incident_id)}
                                            className={cn(
                                                "group cursor-pointer bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300",
                                                selectedIncidentId === inc.incident_id && "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.05)]"
                                            )}
                                        >
                                            <td className="px-6 py-4 first:rounded-l-xl">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-slate-500 uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">#{inc.incident_id.substring(0, 8)}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 mt-0.5">{inc.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-slate-200">{inc.service}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {getSeverityBadge(inc.severity)}
                                                    <div className="h-1 w-1 rounded-full bg-slate-800" />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{inc.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right last:rounded-r-xl">
                                                <span className="text-xs font-bold text-slate-500">{new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Panel with transition */}
            <AnimatePresence mode="wait">
                {selectedIncidentId && (
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="w-full lg:w-1/2 h-full z-20"
                    >
                        <IncidentDetailsPanel
                            incidentId={selectedIncidentId}
                            onClose={() => setSelectedIncidentId(null)}
                            incidents={incidents}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
