'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Activity, 
  Server, 
  ShieldAlert, 
  Clock, 
  Zap 
} from 'lucide-react';

// --- Types ---
interface MetricPoint {
  time: string;
  cpu: number;
  memory: number;
  latency: number;
  isAnomaly?: boolean;
}

interface SeverityData {
  name: string;
  value: number;
  color: string;
}

interface ServiceIncidentData {
  service: string;
  incidents: number;
}

// --- Mock Data ---
const SEVERITY_DATA: SeverityData[] = [
  { name: 'Critical', value: 12, color: '#ef4444' }, // red-500
  { name: 'High', value: 25, color: '#f97316' },     // orange-500
  { name: 'Medium', value: 45, color: '#eab308' },   // yellow-500
  { name: 'Low', value: 18, color: '#22c55e' },      // green-500
];

const SERVICE_DATA: ServiceIncidentData[] = [
  { service: 'payment-service', incidents: 34 },
  { service: 'auth-service', incidents: 21 },
  { service: 'notification-service', incidents: 42 },
  { service: 'orders-service', incidents: 28 },
];

const generateMetrics = (): MetricPoint[] => {
  const points: MetricPoint[] = [];
  const now = new Date();
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const cpu = 40 + Math.random() * 30;
    const isAnomaly = i === 5 || i === 12; // Force some anomalies
    points.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cpu: isAnomaly ? 85 + Math.random() * 10 : cpu,
      memory: 60 + Math.random() * 20,
      latency: isAnomaly ? 400 + Math.random() * 200 : 120 + Math.random() * 50,
      isAnomaly,
    });
  }
  return points;
};

// --- Custom Components ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a]/95 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-2xl">
        <p className="text-slate-400 text-xs mb-2 font-mono">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color || entry.payload.color }} 
            />
            <span className="text-slate-200 text-sm font-medium">{entry.name}:</span>
            <span className="text-slate-100 text-sm font-bold">
              {entry.value}{entry.name === 'Latency' ? 'ms' : '%'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CardHeader = ({ title, icon: Icon, subtitle }: { title: string, icon: any, subtitle?: string }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">
        <Icon className="w-5 h-5 text-indigo-400" />
      </div>
      <div>
        <h3 className="text-slate-100 font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Live</span>
    </div>
  </div>
);

const IncidentAnalyticsPanel = () => {
  const metricsData = useMemo(() => generateMetrics(), []);

  return (
    <div className="w-full space-y-6 mb-8">
      {/* Top Row: System Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-[#1e293b]/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        
        <CardHeader 
          title="System Resilience Monitoring" 
          icon={Activity} 
          subtitle="Real-time CPU, Memory and Network Latency tracking"
        />

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metricsData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                name="CPU Usage"
                stroke="#818cf8" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCpu)" 
                animationDuration={2000}
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                name="Memory"
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
                animationDuration={2500}
              />
              {/* Anomaly Dots */}
              <Line
                type="monotone"
                dataKey="latency"
                name="Latency"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.isAnomaly) {
                    return (
                      <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} className="animate-pulse" />
                    );
                  }
                  return null;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Severity Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#1e293b]/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
        >
          <CardHeader title="Incident Severity Breakdown" icon={ShieldAlert} />
          
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SEVERITY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={500}
                  animationDuration={1500}
                >
                  {SEVERITY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center" 
                  layout="horizontal"
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-300 text-sm font-medium">{value}</span>}
                />
                {/* Center Label */}
                <text
                  x="50%"
                  y="48%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-100 font-bold text-2xl"
                >
                  {SEVERITY_DATA.reduce((acc, curr) => acc + curr.value, 0)}
                </text>
                <text
                  x="50%"
                  y="56%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-400 text-xs uppercase tracking-widest"
                >
                  Total Incidents
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right: Service Distribution Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#1e293b]/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
        >
          <CardHeader title="Incidents by Service" icon={Server} />
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SERVICE_DATA} layout="vertical" margin={{ left: 20, right: 30 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="service" 
                  type="category" 
                  stroke="#64748b" 
                  fontSize={11} 
                  width={120}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar 
                  dataKey="incidents" 
                  fill="url(#barGradient)" 
                  radius={[0, 4, 4, 0]} 
                  barSize={24}
                  animationDuration={2000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 blur-[150px] rounded-full" />
      </div>
    </div>
  );
};

export default IncidentAnalyticsPanel;
