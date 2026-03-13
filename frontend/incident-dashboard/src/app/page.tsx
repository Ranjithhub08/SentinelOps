'use client';

import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Globe, 
  Zap, 
  Search,
  Bell,
  Fingerprint,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import SystemMetricsCard from '@/components/SystemMetricsCard';
import IncidentTable from '@/components/IncidentTable';
import AlertFeed from '@/components/AlertFeed';

const metrics = [
  { 
    label: 'Total Incidents', 
    value: '1,284', 
    icon: ShieldAlert, 
    color: 'text-rose-400', 
    bgColor: 'bg-rose-500/10',
    trend: { value: '+12%', isUp: false }
  },
  { 
    label: 'Active Alerts', 
    value: '42', 
    icon: Bell, 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-500/10',
    trend: { value: '-4%', isUp: true }
  },
  { 
    label: 'System Load', 
    value: '68%', 
    icon: Activity, 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/10',
    trend: { value: 'In Band', isUp: true }
  },
  { 
    label: 'Nodes Online', 
    value: '128/128', 
    icon: Globe, 
    color: 'text-indigo-400', 
    bgColor: 'bg-indigo-500/10',
    trend: { value: 'Steady', isUp: true }
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-8 p-8 max-w-[1600px] mx-auto min-h-screen relative">
      {/* Animated Noise Texture Overlay */}
      <div className="noise-overlay" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest text-indigo-400">
              Operational Intelligence
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white italic">
            Command <span className="text-vanta">Center</span> 
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2 max-w-md">
            Real-time heuristic analysis of global infrastructure and threat vectors.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center space-x-4"
        >
          <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center relative overflow-hidden group cursor-pointer transition-transform hover:scale-110 hover:z-20">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                      <Fingerprint size={16} className="text-slate-400 group-hover:text-white transition-colors" />
                  </div>
              ))}
          </div>
          <button className="btn-elite flex items-center space-x-3">
            <span>System Status</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </button>
        </motion.div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6 relative z-10">
        
        {/* Metrics Row (Full Width) */}
        <div className="col-span-12">
            <SystemMetricsCard metrics={metrics} />
        </div>

        {/* Main Intelligence Table (Bento Box 1) */}
        <div className="col-span-12 lg:col-span-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-[600px]"
            >
                <IncidentTable />
            </motion.div>
        </div>

        {/* Live Signal Feed (Bento Box 2) */}
        <div className="col-span-12 lg:col-span-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-[600px]"
            >
                <AlertFeed />
            </motion.div>
        </div>

        {/* Secondary Insights (Bento Box 3) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 h-48">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="glass-elite h-full p-6 flex flex-col justify-between group cursor-pointer"
            >
                <div className="flex items-center justify-between">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Activity className="text-indigo-400" size={20} />
                    </div>
                    <ArrowUpRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Global Latency</h4>
                    <p className="text-2xl font-black text-white italic">24.2 <span className="text-xs italic text-slate-500">ms</span></p>
                </div>
            </motion.div>
        </div>

        {/* Secondary Insights (Bento Box 4) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 h-48">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="glass-elite h-full p-6 flex flex-col justify-between group cursor-pointer"
            >
                <div className="flex items-center justify-between">
                    <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 group-hover:scale-110 transition-transform">
                        <ShieldAlert className="text-rose-400" size={20} />
                    </div>
                    <ArrowUpRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Threat Level</h4>
                    <p className="text-2xl font-black text-rose-400 italic uppercase">Elevated</p>
                </div>
            </motion.div>
        </div>

        {/* Secondary Insights (Bento Box 5) */}
        <div className="col-span-12 md:col-span-12 lg:col-span-4 h-48">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="glass-elite h-full p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
                <div className="flex items-center justify-between relative z-10">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <Zap className="text-emerald-400" size={20} />
                    </div>
                    <ArrowUpRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <div className="relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Optimization</h4>
                    <p className="text-2xl font-black text-white italic">Elite</p>
                </div>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                    <Globe size={120} />
                </div>
            </motion.div>
        </div>

      </div>

      {/* Background Cinematic Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
