import React, { useState, useMemo } from 'react';
import { LineChart as LineChartIcon, Calendar, Filter, Download } from 'lucide-react';
import { getAnalyticsTrends } from '../services/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Analytics = () => {
  const [timeframe, setTimeframe] = useState('30D'); // 7D | 30D | 3M | 6M | 1Y

  const rawData = useMemo(() => getAnalyticsTrends(timeframe), [timeframe]);

  // Transform raw data lists into Recharts data array format
  const chartData = useMemo(() => {
    return rawData.labels.map((lbl, idx) => ({
      date: lbl,
      health: rawData.healthData[idx],
      temp: rawData.tempData[idx],
      vib: rawData.vibrationData[idx],
      rpm: rawData.rpmData[idx],
      oil: rawData.oilData[idx],
      fuel: rawData.fuelData[idx],
      rul: rawData.rulData[idx],
    }));
  }, [rawData]);

  return (
    <div className="space-y-6">
      {/* Header & Timeframe Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-cyan-500/20">
        <div>
          <h2 className="text-2xl font-tech font-bold text-white tracking-wide flex items-center gap-2">
            <LineChartIcon className="w-6 h-6 text-cyan-400" />
            Engineering Analytics & Historical Trends
          </h2>
          <p className="text-xs text-slate-400 font-subtech mt-0.5">
            Long-term historical telemetry degradation trends for predictive maintenance planning
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-2 bg-navy-950 p-1.5 rounded-2xl border border-cyan-500/20 text-xs">
          {['7D', '30D', '3M', '6M', '1Y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-xl font-tech font-bold transition-all ${
                timeframe === tf
                  ? 'bg-cyan-500 text-navy-950 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 6 Trend Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Health Score Trend */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-tech text-sm font-bold text-white">Engine Health Trend</h3>
            <span className="text-xs text-cyan-400 font-mono-code">% Score</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.08)" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 9 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: '#060a17', borderColor: '#00f0ff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="health" stroke="#00f0ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Temperature Trend */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-tech text-sm font-bold text-white">Temperature Trend</h3>
            <span className="text-xs text-amber-400 font-mono-code">°C</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.08)" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: '#060a17', borderColor: '#f59e0b', fontSize: '11px' }} />
                <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Vibration Trend */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-tech text-sm font-bold text-white">Vibration Trend</h3>
            <span className="text-xs text-purple-400 font-mono-code">g</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.08)" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: '#060a17', borderColor: '#a855f7', fontSize: '11px' }} />
                <Line type="monotone" dataKey="vib" stroke="#a855f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Oil Pressure Trend */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-tech text-sm font-bold text-white">Oil Pressure Trend</h3>
            <span className="text-xs text-cyan-400 font-mono-code">bar</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.08)" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: '#060a17', borderColor: '#00f0ff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="oil" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Fuel Consumption Trend */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-tech text-sm font-bold text-white">Fuel Rate Trend</h3>
            <span className="text-xs text-emerald-400 font-mono-code">L/h</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.08)" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: '#060a17', borderColor: '#34d399', fontSize: '11px' }} />
                <Line type="monotone" dataKey="fuel" stroke="#34d399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. RUL Trend */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-tech text-sm font-bold text-white">RUL Degradation Curve</h3>
            <span className="text-xs text-cyan-300 font-mono-code">Hours</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.08)" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: '#060a17', borderColor: '#00f0ff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="rul" stroke="#00e5ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
