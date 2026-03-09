"use client";
import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Shield, ShieldQuestion } from 'lucide-react';
import IncidentDetailsPanel from './IncidentDetailsPanel';

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
            try {
                const response = await fetch('http://localhost:8004/incidents');
                if (response.ok) {
                    const data = await response.json();
                    setIncidents(data);
                }
            } catch (error) {
                console.error('Failed to fetch incidents', error);
            } finally {
                setLoading(false);
            }
        }
        fetchIncidents();
        const interval = setInterval(fetchIncidents, 10000); // Polling
        return () => clearInterval(interval);
    }, []);

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return <span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-xs font-semibold flex items-center gap-1 w-max"><ShieldAlert className="w-3 h-3" /> CRITICAL</span>;
            case 'HIGH': return <span className="px-2 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded text-xs font-semibold flex items-center gap-1 w-max"><ShieldTriangle className="w-3 h-3" /> HIGH</span>;
            case 'MEDIUM': return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded text-xs font-semibold flex items-center gap-1 w-max"><Shield className="w-3 h-3" /> MEDIUM</span>;
            default: return <span className="px-2 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded text-xs font-semibold flex items-center gap-1 w-max"><ShieldCheck className="w-3 h-3" /> LOW</span>;
        }
    };

    // Mock a ShieldTriangle icon since it doesn't exist directly, using AlertTriangle instead
    const ShieldTriangle = ({ className }: { className: string }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    );

    return (
        <div className="flex gap-6 h-full">
            <div className={`glass-card flex-1 flex flex-col ${selectedIncidentId ? 'hidden md:flex md:w-1/2' : 'w-full'}`}>
                <h3 className="text-xl font-bold mb-4 text-slate-100 border-b border-slate-800 pb-4">Active Incidents</h3>
                <div className="flex-1 overflow-auto rounded-lg border border-slate-800">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 bg-slate-900/50 uppercase border-b border-slate-800 sticky top-0">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Service</th>
                                <th className="px-4 py-3">Severity</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3 text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-8 text-slate-500">Loading incidents...</td></tr>
                            ) : incidents.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-slate-500">No active incidents detected.</td></tr>
                            ) : (
                                incidents.map((inc) => (
                                    <tr
                                        key={inc.incident_id}
                                        onClick={() => setSelectedIncidentId(inc.incident_id)}
                                        className={`border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer transition-colors
                      ${selectedIncidentId === inc.incident_id ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : ''}
                    `}
                                    >
                                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{inc.incident_id.substring(0, 8)}</td>
                                        <td className="px-4 py-3 font-medium text-slate-200">{inc.service}</td>
                                        <td className="px-4 py-3">{getSeverityBadge(inc.severity)}</td>
                                        <td className="px-4 py-3 text-slate-300">{inc.type}</td>
                                        <td className="px-4 py-3 text-right text-slate-500">{new Date(inc.timestamp).toLocaleTimeString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedIncidentId && (
                <div className="w-full md:w-1/2 h-full">
                    <IncidentDetailsPanel
                        incidentId={selectedIncidentId}
                        onClose={() => setSelectedIncidentId(null)}
                        incidents={incidents}
                    />
                </div>
            )}
        </div>
    );
}
