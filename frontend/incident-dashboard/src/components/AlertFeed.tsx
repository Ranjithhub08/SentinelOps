"use client";
import { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface AlertMessage {
    id: string;
    message: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    timestamp: string;
}

export default function AlertFeed() {
    const [alerts, setAlerts] = useState<AlertMessage[]>([]);

    useEffect(() => {
        // Placeholder for websocket or SSE connection
        // Simulating an incoming alert stream
        const defaultAlerts: AlertMessage[] = [
            { id: '1', message: 'High CPU threshold exceeded on payment-api', type: 'critical', timestamp: new Date(Date.now() - 50000).toISOString() },
            { id: '2', message: 'Database latency returned to normal', type: 'success', timestamp: new Date(Date.now() - 300000).toISOString() },
            { id: '3', message: 'Spike in error rates detected on auth-service', type: 'warning', timestamp: new Date(Date.now() - 1200000).toISOString() }
        ];
        setAlerts(defaultAlerts);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'critical': return <ShieldAlert className="w-5 h-5 text-rose-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="glass-card h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-slate-400" />
                Live Alert Feed
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {alerts.map(alert => (
                    <div key={alert.id} className="flex gap-3 items-start p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                        <div className="mt-0.5">{getIcon(alert.type)}</div>
                        <div>
                            <p className="text-sm text-slate-200">{alert.message}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
                {alerts.length === 0 && (
                    <div className="text-center text-slate-500 mt-10">No recent alerts.</div>
                )}
            </div>
        </div>
    );
}
