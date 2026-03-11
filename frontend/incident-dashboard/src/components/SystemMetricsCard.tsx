'use client';

import { motion } from 'framer-motion';
import { Activity, Cpu, ServerCrash, Clock, LucideIcon } from 'lucide-react';

export interface Metric {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    bgColor: string;
}

interface SystemMetricsCardProps {
    metrics?: Metric[];
}

const defaultMetrics: Metric[] = [
    { label: 'Global Health', value: '99.9%', icon: Activity, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { label: 'Active Incidents', value: '0', icon: ServerCrash, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
    { label: 'Avg Resolution', value: '14m', icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { label: 'Avg CPU Temp', value: '62°C', icon: Cpu, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
];

export default function SystemMetricsCard({ metrics = defaultMetrics }: SystemMetricsCardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
                <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="glass-card flex flex-col justify-between group h-36 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between z-10">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{metric.label}</span>
                        <div className={`p-2.5 rounded-xl ${metric.bgColor} ${metric.color} transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]`}>
                            <metric.icon size={18} />
                        </div>
                    </div>
                    
                    <div className="z-10 mt-auto">
                        <div className="flex items-baseline space-x-1">
                            <span className="text-4xl font-black text-white tracking-tighter group-hover:text-indigo-400 transition-colors duration-500">
                                {metric.value}
                            </span>
                        </div>
                    </div>
                    
                    {/* Abstract decorative element */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.03 }}
                        className="absolute -right-6 -bottom-6 transition-all duration-700 group-hover:opacity-[0.08] group-hover:scale-110"
                    >
                        <metric.icon size={120} />
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
}
