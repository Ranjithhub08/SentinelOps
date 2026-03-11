'use client';

import { useState, useEffect } from 'react';
import SystemMetricsCard, { Metric } from '@/components/SystemMetricsCard';
import IncidentTable from '@/components/IncidentTable';
import AlertFeed from '@/components/AlertFeed';
import { Activity, Cpu, ServerCrash, Clock } from 'lucide-react';
import { MOCK_INCIDENTS } from '@/components/mockData';

export default function OverviewPage() {
    const [incidentCount, setIncidentCount] = useState<number>(0);

    useEffect(() => {
        async function fetchIncidentCount() {
            const apiUrl = process.env.NEXT_PUBLIC_INCIDENT_API_URL || 'http://localhost:8004';
            try {
                const response = await fetch(`${apiUrl}/incidents`);
                if (response.ok) {
                    const data = await response.json();
                    setIncidentCount(data.length);
                } else if (!process.env.NEXT_PUBLIC_INCIDENT_API_URL) {
                    // Fallback to mock count if local backend is down and no prod URL provided
                    setIncidentCount(MOCK_INCIDENTS.length);
                }
            } catch (error) {
                console.error('Failed to fetch incident count', error);
                if (!process.env.NEXT_PUBLIC_INCIDENT_API_URL) {
                    setIncidentCount(MOCK_INCIDENTS.length);
                }
            }
        }

        fetchIncidentCount();
        const interval = setInterval(fetchIncidentCount, 10000); // Polling every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const metrics: Metric[] = [
        { label: 'Global Health', value: '99.9%', icon: Activity, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
        { label: 'Active Incidents', value: incidentCount.toString(), icon: ServerCrash, color: incidentCount > 0 ? 'text-rose-500' : 'text-slate-500', bgColor: incidentCount > 0 ? 'bg-rose-500/10' : 'bg-slate-500/10' },
        { label: 'Avg Resolution', value: '14m', icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
        { label: 'Avg CPU Temp', value: '62°C', icon: Cpu, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
    ];

    return (
        <div className="h-full flex flex-col space-y-8">
            <div className="flex flex-col">
                <h2 className="text-4xl font-black tracking-tight text-gradient">
                    System Intelligence
                </h2>
                <p className="text-slate-400 text-sm mt-1 font-medium">Real-time health monitoring and anomaly detection</p>
            </div>

            <SystemMetricsCard metrics={metrics} />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
                <div className="lg:col-span-8 flex flex-col h-full rounded-2xl overflow-hidden glass-panel border-white/5">
                    <IncidentTable />
                </div>
                <div className="lg:col-span-4 h-full">
                    <AlertFeed />
                </div>
            </div>
        </div>
    );
}
