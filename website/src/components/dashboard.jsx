import { useEffect, useState } from "react";
export function Dashboard() {
    const [stats, setStats] = useState(null);
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    
    useEffect(() => {
        const fetchStats = () => {
            fetch(`${API_BASE}/api/dashboard`)
                .then(res => res.json())
                .then(data => setStats(data));
        }
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, [])

    if (!stats) {
        return (
            <>
                <div className="text-white">Connecting to MTUNES Core...</div>
            </>
        )
    }
    return (
        <div className="p-8 bg-[#070b11] min-h-screen">
            <h2 className="text-3xl font-bold text-white mb-8">System Oversight</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 text-sm uppercase tracking-widest">Active Nodes</p>
                    <h3 className="text-4xl font-black text-indigo-500">{stats.server_count} Servers</h3>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 text-sm uppercase tracking-widest">Core Status</p>
                    <h3 className={`text-4xl font-black ${stats.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                        {stats.status.toUpperCase()}
                    </h3>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 text-sm uppercase tracking-widest">Signal Mode</p>
                    <h3 className="text-4xl font-black text-purple-500">
                        {stats.radio_active ? "RADIO ON" : "STANDARD"}
                    </h3>
                </div>
            </div>

            <div className="mt-8 bg-slate-800/30 p-6 rounded-3xl border border-slate-800">
                <h4 className="text-xl font-bold mb-4">Live Audio Feeds</h4>
                {Object.keys(stats.now_playing).length > 0 ? (
                    Object.entries(stats.now_playing).map(([id, title]) => (
                        <div key={id} className="flex justify-between py-2 border-b border-slate-800">
                            <span className="text-slate-500">Node {String(id).slice(-4)}</span>
                            <span className="text-indigo-400 font-medium">Playing: {title}</span>
                        </div>
                    ))) : (
                    <p className="text-slate-600 italic">No active streams across the network.</p>
                )}
            </div>
        </div>
    )
}