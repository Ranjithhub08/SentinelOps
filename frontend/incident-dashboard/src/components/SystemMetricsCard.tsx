import { Activity, Cpu, ServerCrash, Clock } from 'lucide-react';

export default function SystemMetricsCard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Global Health</p>
                    <h3 className="text-3xl font-bold text-emerald-400">99.9%</h3>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <Activity className="w-6 h-6 text-emerald-500" />
                </div>
            </div>

            <div className="glass-card flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Active Incidents</p>
                    <h3 className="text-3xl font-bold text-rose-400">3</h3>
                </div>
                <div className="p-3 bg-rose-500/10 rounded-lg">
                    <ServerCrash className="w-6 h-6 text-rose-500" />
                </div>
            </div>

            <div className="glass-card flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Avg Resolution</p>
                    <h3 className="text-3xl font-bold text-amber-400">14m</h3>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg">
                    <Clock className="w-6 h-6 text-amber-500" />
                </div>
            </div>

            <div className="glass-card flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Avg CPU Temp</p>
                    <h3 className="text-3xl font-bold text-blue-400">62°C</h3>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Cpu className="w-6 h-6 text-blue-500" />
                </div>
            </div>
        </div>
    );
}
