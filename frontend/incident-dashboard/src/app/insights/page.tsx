'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, Lightbulb, Sparkles, Zap, ArrowUpRight, Fingerprint } from 'lucide-react';

export default function InsightsPage() {
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
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                            Neural Processing
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic">
                        Intelligence <span className="text-vanta">Hub</span> 
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-2 max-w-md">
                        AI-synthesized correlations and predictive heuristic analysis.
                    </p>
                </motion.div>

                <div className="flex items-center space-x-3">
                    <button className="btn-elite py-2.5">
                        Deep Diagnostic
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {[
                    {
                        title: "Weekly Heuristics",
                        content: "Analysis of the last 7 days indicates that 45% of high CPU incidents correlate directly with batch scheduling spikes.",
                        recommendation: "Implement staggered job executions to smooth resource demand.",
                        color: "purple",
                        icon: BrainCircuit
                    },
                    {
                        title: "Topology Vulnerability",
                        content: "The metrics-collector-service has exhibited intermittent connection timeouts (12 in the last 24h) attempting to push to Kafka.",
                        recommendation: "Adjust the retry backoff configuration and verify network capacity.",
                        color: "indigo",
                        icon: Fingerprint
                    }
                ].map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 + (index * 0.1), ease: [0.22, 1, 0.36, 1] }}
                        className="glass-elite refractive-edge p-8 group cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3 bg-${item.color}-500/10 rounded-2xl border border-${item.color}-500/20 group-hover:scale-110 transition-transform`}>
                                <item.icon className={`text-${item.color}-400`} size={24} />
                            </div>
                            <ArrowUpRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-black text-white italic mb-4 uppercase tracking-tight">{item.title}</h3>
                        <p className="text-slate-400 font-medium leading-relaxed mb-8">
                            {item.content}
                        </p>
                        <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Lightbulb size={24} className={`text-${item.color}-400`} />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Recommendation</h4>
                            <p className="text-xs font-bold text-white leading-relaxed">
                                {item.recommendation}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Decorative Lights */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
