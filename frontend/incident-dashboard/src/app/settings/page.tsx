'use client';

import { motion } from 'framer-motion';
import { 
    Settings, 
    User, 
    Shield, 
    Bell, 
    Zap, 
    Database, 
    Key, 
    Lock,
    Save,
    Fingerprint,
    Cpu,
    Globe
} from 'lucide-react';

export default function SettingsPage() {
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
                        <span className="px-2 py-0.5 rounded-full bg-slate-500/10 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            Protocol Configuration
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white italic">
                        System <span className="text-vanta">Control</span> 
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-2 max-w-md">
                        Fine-tuning operational parameters and security synchronization.
                    </p>
                </motion.div>

                <div className="flex items-center space-x-3">
                    <button className="btn-elite flex items-center space-x-3">
                        <Save size={14} />
                        <span>Apply Protocol</span>
                    </button>
                </div>
            </div>

            {/* Settings Layout */}
            <div className="grid grid-cols-12 gap-8 relative z-10 flex-1 min-h-0">
                
                {/* Navigation Sidebar (Local) */}
                <div className="col-span-12 lg:col-span-3 space-y-2">
                    {[
                        { icon: User, label: "Core Identity", active: true },
                        { icon: Shield, label: "Security Matrix", active: false },
                        { icon: Bell, label: "Signal Tuning", active: false },
                        { icon: Database, label: "Data Persistence", active: false },
                        { icon: Zap, label: "AI Heuristics", active: false },
                        { icon: Key, label: "Access Vault", active: false },
                    ].map((item) => (
                        <button 
                            key={item.label}
                            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-500 text-left ${
                                item.active ? 'glass-elite bg-indigo-500/10 border-indigo-500/30 text-white font-bold' : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'
                            }`}
                        >
                            <item.icon size={18} />
                            <span className="text-xs uppercase tracking-widest font-black">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Settings Panel */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="col-span-12 lg:col-span-9 glass-elite refractive-edge p-10 space-y-12 h-fit"
                >
                    {/* Section: Profile */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <Fingerprint className="text-indigo-400" size={20} />
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Core Identity Specification</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Operator Signature</label>
                                <input 
                                    type="text" 
                                    defaultValue="RANJITH_KUMAR"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Neural Integration</label>
                                <input 
                                    type="email" 
                                    defaultValue="ranjith@sentinel.ops"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all opacity-50 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section: Security */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <Lock className="text-rose-400" size={20} />
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Encryption Protocol</h3>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-indigo-500/20 transition-all cursor-pointer">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-indigo-500/10 rounded-xl">
                                    <Shield size={20} className="text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white uppercase tracking-tight">Multi-Factor Biometrics</p>
                                    <p className="text-[10px] font-bold text-slate-500 capitalize">Enhanced verification via spatial fingerprinting</p>
                                </div>
                            </div>
                            <div className="w-12 h-6 bg-indigo-500 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                            </div>
                        </div>
                    </section>

                    {/* Section: Diagnostics */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <Cpu className="text-emerald-400" size={20} />
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">System Diagnostics</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "78%" }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Stability Index</span>
                                <span className="text-[10px] font-black text-white italic">78.4%</span>
                            </div>
                        </div>
                    </section>
                </motion.div>

            </div>

            {/* Cinematic Background Lighting */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[30%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] right-[30%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
