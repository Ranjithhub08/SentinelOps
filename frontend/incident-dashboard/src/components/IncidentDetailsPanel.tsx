"use client";
import { useEffect, useState } from 'react';
import { X, Server, Activity, AlertCircle, FileText, Bot, BrainCircuit, ExternalLink } from 'lucide-react';
import { Incident } from './IncidentTable';

export default function IncidentDetailsPanel({ incidentId, onClose, incidents }: { incidentId: string, onClose: () => void, incidents: Incident[] }) {
    const [incident, setIncident] = useState<Incident | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We try to fetch detailed info. If the backend endpoint doesn't return AI enriched data, 
        // we use mock enrichment here for UI demonstration purposes as specified ("Display incident data including... root cause, explanation").
        async function loadDetails() {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8004/incidents/${incidentId}`);
                if (res.ok) {
                    const data = await res.json();
                    // Mocking the AI enriched data that would usually come from a consolidated backend API
                    const mockedEnrichedData = {
                        ...data,
                        root_cause: data.type === 'HIGH_CPU' ? 'Resource saturation' :
                            data.type === 'HIGH_LATENCY' ? 'Slow downstream dependency' :
                                'Service instability',
                        explanation: data.type === 'HIGH_CPU' ? 'CPU usage exceeded safe limits indicating resource saturation.' :
                            'Anomalous behavior detected requiring attention.',
                        suggested_action: data.type === 'HIGH_CPU' ? 'Consider scaling the service or optimizing resource-intensive operations.' :
                            'Investigate recent deployments or configuration changes.',
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

    if (loading) return <div className="glass-card h-full flex items-center justify-center text-slate-400">Loading incident data...</div>;
    if (!incident) return <div className="glass-card h-full flex items-center justify-center text-rose-400">Incident not found</div>;

    return (
        <div className="glass-card h-full flex flex-col relative overflow-hidden">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                <X className="w-4 h-4 text-slate-300" />
            </button>

            <div className="mb-6 border-b border-slate-800 pb-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <AlertCircle className="text-rose-500" />
                    Incident Details
                </h2>
                <p className="text-slate-400 font-mono text-sm">ID: {incident.incident_id}</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80">
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><Server className="w-3 h-3" /> Service</p>
                        <p className="text-slate-200 font-semibold">{incident.service}</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80">
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Type</p>
                        <p className="text-slate-200 font-semibold">{incident.type}</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80">
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Severity</p>
                        <p className="text-rose-400 font-bold">{incident.severity}</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80">
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Status</p>
                        <p className="text-emerald-400 font-bold">{incident.status}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 p-5 rounded-lg border border-blue-500/20 relative">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <BrainCircuit className="w-24 h-24" />
                    </div>
                    <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                        <Bot className="w-4 h-4" /> AI Root Cause Analysis
                    </h3>
                    <div className="space-y-4 relative z-10">
                        <div>
                            <p className="text-indigo-300 text-xs uppercase tracking-wider mb-1">Detected Root Cause</p>
                            <p className="text-slate-200 font-medium">{incident.root_cause || "Pending AI analysis..."}</p>
                        </div>
                        <div>
                            <p className="text-indigo-300 text-xs uppercase tracking-wider mb-1">Explanation</p>
                            <p className="text-slate-300 text-sm leading-relaxed">{incident.explanation || "No explanation available yet."}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-900/10 p-5 rounded-lg border border-emerald-500/20">
                    <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Suggested Remediation
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {incident.suggested_action || "Awaiting remediation suggestions."}
                    </p>
                    <div className="mt-4 pt-4 border-t border-emerald-500/20">
                        <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-md text-sm font-medium hover:bg-emerald-500/30 transition flex items-center gap-2">
                            Execute Runbook <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
