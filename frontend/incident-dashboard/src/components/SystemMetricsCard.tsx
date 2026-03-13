'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Metric {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

interface SystemMetricsCardProps {
  metrics: Metric[];
}

export default function SystemMetricsCard({ metrics }: SystemMetricsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass-elite refractive-edge p-6 group cursor-pointer relative"
          onMouseMove={(e) => {
            const { currentTarget, clientX, clientY } = e;
            const { left, top } = currentTarget.getBoundingClientRect();
            currentTarget.style.setProperty("--mouse-x", `${clientX - left}px`);
            currentTarget.style.setProperty("--mouse-y", `${clientY - top}px`);
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={cn("p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110", metric.bgColor, `border-${metric.color.split('-')[1]}-500/20`)}>
              <metric.icon className={cn("transition-colors duration-500", metric.color)} size={20} />
            </div>
            {metric.trend && (
              <div className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                metric.trend.isUp ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
              )}>
                {metric.trend.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span>{metric.trend.value}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">
              {metric.label}
            </h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white tracking-tighter text-vanta">
                {metric.value}
              </span>
            </div>
          </div>

          {/* Animated Sparkline (Simulated with SVG Path) */}
          <div className="mt-6 h-12 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 + index * 0.1, ease: "easeInOut" }}
                d={`M 0 ${10 + Math.random() * 5} Q 25 ${Math.random() * 20} 50 10 T 100 ${5 + Math.random() * 10}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={cn("opacity-30 group-hover:opacity-60 transition-opacity duration-700", metric.color)}
              />
              {/* Glow effect for the path */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
                transition={{ duration: 2, delay: 0.5 + index * 0.1, ease: "easeInOut" }}
                d={`M 0 ${10 + Math.random() * 5} Q 25 ${Math.random() * 20} 50 10 T 100 ${5 + Math.random() * 10}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className={cn("blur-md transition-opacity duration-700", metric.color)}
              />
            </svg>
          </div>

          {/* Elite Hover Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </motion.div>
      ))}
    </div>
  );
}
