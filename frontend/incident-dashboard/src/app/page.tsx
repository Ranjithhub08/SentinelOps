import SystemMetricsCard from '@/components/SystemMetricsCard';
import IncidentTable from '@/components/IncidentTable';
import AlertFeed from '@/components/AlertFeed';

export default function OverviewPage() {
    return (
        <div className="h-full flex flex-col">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400 mb-6">
                Platform Overview
            </h2>

            <SystemMetricsCard />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <div className="lg:col-span-2 flex flex-col h-full rounded-xl overflow-hidden glass-panel">
                    <IncidentTable />
                </div>
                <div className="lg:col-span-1 h-full">
                    <AlertFeed />
                </div>
            </div>
        </div>
    );
}
