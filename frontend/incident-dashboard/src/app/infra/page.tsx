'use client';

import { motion } from 'framer-motion';
import { 
    Globe, 
    Server, 
    Database, 
    Cpu, 
    Network, 
    ShieldCheck, 
    ArrowUpRight,
    Search,
    Filter,
    Activity
} from 'lucide-react';

export default function InfraPage() {
    const nodes = [
        { id: 'k8s-cluster-alpha', type: 'cluster', status: 'healthy', load: '42%' },
        { id: 'db-primary-prod', type: 'database', status: 'healthy', load: '28%' },
        { id: 'edge-gateway-01', type: 'gateway', status: 'warning', load: '89%' },
        { id: 'auth-service-pod', type: 'service', status: 'healthy', load: '15%' },
        { id: 'redis-cache-01', type: 'cache', status: 'healthy', load: '12%' },
        { id: 'logging-aggregator', type: 'service', status: 'healthy', load: '35%' },
    ];

    return (
        <div className="h-full flex flex-col space-y-8 relative overflow-visible">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                            Global Topology
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic">
                        Infra <span className="text-vanta">Vision</span> 
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-2 max-w-md">
                        Real-time spatial mapping of distributed services and node health.
                    </p>
                </motion.div>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input 
                            type="text" 
                            placeholder="Locate node..." 
                            className="bg-slate-950/50 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Infrastructure Map Container */}
            <div className="grid grid-cols-12 gap-6 relative z-10 flex-1 min-h-0">
                
                {/* Visual Topology Map (Cinematic Placeholder) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="col-span-12 lg:col-span-8 glass-elite refractive-edge p-8 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[400px]"
                >
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2),transparent_70%)]" />
                        <Network className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-indigo-500" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 animate-pulse">
                            <Globe className="text-indigo-400" size={40} />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2 italic">Neural Network Active</h3>
                        <p className="text-xs text-slate-500 font-bold max-w-xs">Initializing spatial coordinates for 128 production nodes across US-EAST-1 and EU-WEST-2.</p>
                    </div>

                    {/* Draggable/Interactive Node Concept */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                                    y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                                }}
                                transition={{ duration: 10 + i, repeat: Infinity, repeatType: 'reverse' }}
                                className="absolute w-3 h-3 bg-indigo-500/40 rounded-full blur-sm"
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Node Inventory Panel */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="col-span-12 lg:col-span-4 glass-elite flex flex-col h-full"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Inventory</h3>
                        <Activity className="text-emerald-500" size={14} />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                        {nodes.map((node) => (
                            <div key={node.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-slate-950/50 rounded-lg">
                                            {node.type === 'cluster' ? <Server size={14} className="text-indigo-400" /> : 
                                             node.type === 'database' ? <Database size={14} className="text-purple-400" /> : 
                                             <Cpu size={14} className="text-slate-400" />}
                                        </div>
                                        <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{node.id}</span>
                                    </div>
                                    <ArrowUpRight size={14} className="text-slate-600 group-hover:text-white" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{node.status}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">{node.load} Load</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>

            {/* Cinematic Background Lighting */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
