import { BrainCircuit, Lightbulb, Sparkles } from 'lucide-react';

export default function InsightsPage() {
    return (
        <div className="h-full flex flex-col">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-6 flex items-center gap-3">
                <BrainCircuit className="w-8 h-8 text-purple-400" />
                AI Insights Hub
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 text-slate-300">

                <div className="glass-card flex flex-col justify-start relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="w-48 h-48" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300 flex items-center gap-2">
                        Weekly Heuristics
                    </h3>
                    <p className="mb-4">
                        Analysis of the last 7 days indicates that <span className="font-bold text-white">45%</span> of high CPU incidents on <code>payment-api</code> correlate directly with batch scheduling spikes occurring around 02:00 UTC.
                    </p>
                    <div className="mt-auto bg-purple-500/10 p-4 rounded-lg outline outline-1 outline-purple-500/30">
                        <p className="flex items-start gap-2 text-sm text-purple-200">
                            <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
                            Recommendation: Implement staggered job executions to smooth resource demand.
                        </p>
                    </div>
                </div>

                <div className="glass-card flex flex-col justify-start relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="w-48 h-48" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center gap-2">
                        Topology Vulnerability
                    </h3>
                    <p className="mb-4">
                        The <code>metrics-collector-service</code> has exhibited intermittent connection timeouts (12 in the last 24h) attempting to push to the local Kafka broker.
                    </p>
                    <div className="mt-auto bg-indigo-500/10 p-4 rounded-lg outline outline-1 outline-indigo-500/30">
                        <p className="flex items-start gap-2 text-sm text-indigo-200">
                            <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
                            Recommendation: Adjust the retry backoff configuration on the Kafka Producer and verify network capacity.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
