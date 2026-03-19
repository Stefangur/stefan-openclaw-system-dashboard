'use client';

import { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';

export default function TokenCostsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTokenCosts();
  }, []);
  
  async function fetchTokenCosts() {
    try {
      const res = await fetch('/api/token-stats/monthly', {
        headers: { 'X-Butler-Token': process.env.NEXT_PUBLIC_BUTLER_TOKEN }
      });
      const data = await res.json();
      setData(data);
    } catch (e) {
      console.error('Failed to fetch token costs:', e);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) return <div className="p-8">Loading...</div>;
  
  return (
    <div className="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen">
      <BackButton />
      <h1 className="text-4xl font-bold text-white mb-8">Token Costs Dashboard</h1>
      
      {/* Simple Bar Chart */}
      <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Daily Costs (Last 30 Days)</h2>
        <div className="flex items-end justify-between h-64 gap-2">
          {data?.entries?.slice(-30).map((entry, i) => {
            const max = Math.max(...(data?.entries?.map(e => e.total) || [1]));
            const height = (entry.total / max) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500 rounded-t" 
                     style={{ height: `${height}%` }} />
                <span className="text-xs text-slate-400 mt-2 rotate-45">
                  {entry.date.slice(-5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500/20 backdrop-blur rounded-lg p-4">
          <div className="text-blue-300 text-sm">Tavily</div>
          <div className="text-white text-2xl font-bold">€{data?.tavily?.toFixed(2)}</div>
        </div>
        <div className="bg-purple-500/20 backdrop-blur rounded-lg p-4">
          <div className="text-purple-300 text-sm">Claude</div>
          <div className="text-white text-2xl font-bold">€{data?.claude?.toFixed(2)}</div>
        </div>
        <div className="bg-pink-500/20 backdrop-blur rounded-lg p-4">
          <div className="text-pink-300 text-sm">GPT</div>
          <div className="text-white text-2xl font-bold">€{data?.gpt?.toFixed(2)}</div>
        </div>
        <div className="bg-amber-500/20 backdrop-blur rounded-lg p-4">
          <div className="text-amber-300 text-sm">Total</div>
          <div className="text-white text-2xl font-bold">€{data?.total?.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Daily Breakdown Table */}
      <div className="bg-slate-800/50 backdrop-blur rounded-lg overflow-hidden">
        <table className="w-full text-white">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-right">Tavily</th>
              <th className="px-4 py-2 text-right">Claude</th>
              <th className="px-4 py-2 text-right">GPT</th>
              <th className="px-4 py-2 text-right">Render</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data?.entries?.map((entry, i) => (
              <tr key={i} className="border-t border-slate-700 hover:bg-slate-700/30">
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2 text-right">€{entry.tavily}</td>
                <td className="px-4 py-2 text-right">€{entry.claude}</td>
                <td className="px-4 py-2 text-right">€{entry.gpt}</td>
                <td className="px-4 py-2 text-right">€{entry.render}</td>
                <td className="px-4 py-2 text-right font-bold">€{entry.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}