import React, { useState } from 'react';
import { Activity, Radio, Clock, Gauge, Flame, Droplet, Wind, RefreshCw, Filter } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const LiveMonitoring = () => {
  const { telemetry, history, isSimulating, setIsSimulating } = useTelemetry();
  const [timeFilter, setTimeFilter] = useState('1H'); // 1H | 6H | 24H
  const [selectedParameter, setSelectedParameter] = useState('temperature'); // temperature | vibration | oilPressure | rpm | fuelConsumption

  const sensorGauges = [
    { id: 'rpm', label: 'RPM', val: `${telemetry.rpm}`, unit: 'RPM', icon: Gauge, color: 'text-cyan-400', key: 'rpm' },
    { id: 'temp', label: 'Temperature', val: `${telemetry.temperature}°C`, unit: '°C', icon: Flame, color: 'text-amber-400', key: 'temperature' },
    { id: 'oil', label: 'Oil Pressure', val: `${telemetry.oilPressure} bar`, unit: 'bar', icon: Droplet, color: 'text-cyan-400', key: 'oilPressure' },
    { id: 'vib', label: 'Vibration', val: `${telemetry.vibration} g`, unit: 'g', icon: Activity, color: 'text-purple-400', key: 'vibration' },
    { id: 'fuel', label: 'Fuel Rate', val: `${telemetry.fuelConsumption} L/h`, unit: 'L/h', icon: Wind, color: 'text-cyan-400', key: 'fuelConsumption' },
    { id: 'load', label: 'Engine Load', val: `${telemetry.engineLoad}%`, unit: '%', icon: Clock, color: 'text-emerald-400', key: 'engineLoad' },
    { id: 'exhaust', label: 'Exhaust Temp', val: `${telemetry.exhaustTemp}°C`, unit: '°C', icon: Flame, color: 'text-amber-500', key: 'exhaustTemp' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-tech font-bold text-white tracking-wide">Live Sensor Data Monitoring</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-tech font-bold text-xs">
              <Radio className="w-3 h-3 animate-pulse text-red-400" />
              LIVE TELEMETRY STREAM
            </div>
          </div>
          <p className="text-xs text-slate-400 font-subtech mt-0.5">
            Continuous real-time multi-channel telemetry streams from aero piston engine sensors
          </p>
        </div>

        {/* Controls: Time Filters & Stream Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-navy-950 p-1 rounded-xl border border-cyan-500/20 text-xs">
            {['1H', '6H', '24H'].map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 rounded-lg font-tech font-bold transition-all ${
                  timeFilter === filter
                    ? 'bg-cyan-500 text-navy-950 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter === '1H' ? 'Last 1 Hour' : filter === '6H' ? 'Last 6 Hours' : 'Last 24 Hours'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3.5 py-1.5 rounded-xl font-tech text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isSimulating
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_#34d399]'
                : 'bg-navy-900 text-slate-400 border-slate-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'STREAM ACTIVE' : 'STREAM PAUSED'}
          </button>
        </div>
      </div>

      {/* Sensor Gauge Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {sensorGauges.map((g) => {
          const Icon = g.icon;
          const isSelected = selectedParameter === g.key;
          return (
            <div
              key={g.id}
              onClick={() => setSelectedParameter(g.key)}
              className={`p-3.5 rounded-2xl glass-panel border cursor-pointer transition-all ${
                isSelected
                  ? 'border-cyan-400 shadow-glow-cyan bg-cyan-500/10'
                  : 'border-cyan-500/20 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-tech text-[11px] truncate">{g.label}</span>
                <Icon className={`w-3.5 h-3.5 ${g.color}`} />
              </div>
              <p className="text-lg font-tech font-bold text-white">{g.val}</p>
              <div className="mt-2 h-1 bg-navy-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-3/4 animate-pulse" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Real-Time Telemetry Graph */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-tech text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              REAL-TIME TELEMETRY GRAPH: <span className="text-cyan-400 uppercase">{selectedParameter}</span>
            </h3>
            <p className="text-xs text-slate-400">Stream buffer refreshing every 2000ms</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-300 bg-navy-950 px-3 py-1.5 rounded-xl border border-cyan-500/20">
            <span>FILTER: {timeFilter}</span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history.length > 0 ? history : [{ time: '12:00', [selectedParameter]: 82 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.08)" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#060a17', borderColor: '#00f0ff', borderRadius: '12px', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey={selectedParameter}
                stroke="#00f0ff"
                strokeWidth={3}
                dot={{ r: 3, fill: '#00f0ff' }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#00f0ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
