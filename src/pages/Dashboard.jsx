import React from 'react';
import { 
  Activity, 
  Flame, 
  Droplet, 
  Wind, 
  Gauge, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  LineChart, 
  Box, 
  ArrowUpRight 
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { Engine3DView } from '../components/Engine3DView';
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const Dashboard = () => {
  const { telemetry, history, alerts, setActiveTab } = useTelemetry();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-cyan-500/20">
        <div>
          <h2 className="text-2xl font-tech font-bold text-white tracking-wide flex items-center gap-2">
            Engine Digital Twin
            <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono-code">
              MALE UAV E-001
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-subtech mt-0.5">
            Real-time engine health and performance overview
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setActiveTab('twin')}
          className="px-4 py-2 rounded-xl bg-navy-850 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-tech text-xs font-bold flex items-center gap-2 transition-all"
        >
          <Box className="w-4 h-4 text-cyan-400" />
          Full-Screen 3D Twin
        </button>
      </div>

      {/* Top Banner KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Engine Health Card */}
        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-tech">
            <span>ENGINE HEALTH</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-tech font-bold text-white">{telemetry.healthScore}%</span>
            <span className={`px-2 py-0.5 rounded text-xs font-tech font-bold ${
              telemetry.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
              telemetry.status === 'Warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
              'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
            }`}>
              {telemetry.status}
            </span>
          </div>
          <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500" 
              style={{ width: `${telemetry.healthScore}%` }} 
            />
          </div>
        </div>

        {/* Potential Fault Card */}
        <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-tech">
            <span>POTENTIAL FAULT</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-lg font-tech font-bold text-amber-300 truncate">{telemetry.predictedFault}</p>
            <p className="text-xs text-slate-400">Probability: <strong className="text-amber-400">{telemetry.faultProbability}%</strong></p>
          </div>
        </div>

        {/* RUL Remaining Useful Life Card */}
        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-tech">
            <span>REMAINING USEFUL LIFE</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-3xl font-tech font-bold text-cyan-300">{telemetry.rulHours}</span>
            <span className="text-xs text-slate-400 ml-1">Hours</span>
          </div>
          <p className="text-[11px] text-slate-400">Estimated until next scheduled overhaul</p>
        </div>

        {/* Maintenance Status Card */}
        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-tech">
            <span>MAINTENANCE STATUS</span>
            <Wrench className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-lg font-tech font-bold text-white">{telemetry.maintenanceStatus}</span>
            <span className="block text-xs text-amber-400 font-tech mt-0.5">Priority: {telemetry.priority || 'High'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Engine Viewport & Telemetry Gauge Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Digital Twin Viewport (7 Cols) */}
        <div className="lg:col-span-7">
          <Engine3DView />
        </div>

        {/* Key Parameter Gauges (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-tech text-sm font-bold text-cyan-400 tracking-wide flex items-center justify-between">
            <span>KEY ENGINE PARAMETERS</span>
            <span className="text-[11px] font-mono-code text-slate-400">8 SENSORS ONLINE</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* RPM */}
            <div className="p-3 rounded-xl bg-navy-900/80 border border-cyan-500/20">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>RPM</span>
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-xl font-tech font-bold text-white mt-1">{telemetry.rpm}</p>
              <p className="text-[10px] text-emerald-400 font-mono-code mt-0.5">● Nominal range</p>
            </div>

            {/* Temperature */}
            <div className={`p-3 rounded-xl border transition-colors ${
              telemetry.temperature > 84 ? 'bg-red-500/15 border-red-500/40 text-red-200' : 'bg-navy-900/80 border-cyan-500/20'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Temperature</span>
                <Flame className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-xl font-tech font-bold mt-1">{telemetry.temperature}°C</p>
              <p className={`text-[10px] font-mono-code mt-0.5 ${telemetry.temperature > 84 ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                {telemetry.temperature > 84 ? '▲ ELEVATED (+14%)' : '● Normal'}
              </p>
            </div>

            {/* Oil Pressure */}
            <div className="p-3 rounded-xl bg-navy-900/80 border border-cyan-500/20">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Oil Pressure</span>
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-xl font-tech font-bold text-white mt-1">{telemetry.oilPressure} bar</p>
              <p className="text-[10px] text-emerald-400 font-mono-code mt-0.5">● Nominal</p>
            </div>

            {/* Vibration */}
            <div className={`p-3 rounded-xl border transition-colors ${
              telemetry.vibration > 0.45 ? 'bg-amber-500/15 border-amber-500/40' : 'bg-navy-900/80 border-cyan-500/20'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Vibration</span>
                <Activity className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-xl font-tech font-bold text-white mt-1">{telemetry.vibration} g</p>
              <p className={`text-[10px] font-mono-code mt-0.5 ${telemetry.vibration > 0.45 ? 'text-amber-400 font-bold' : 'text-emerald-400'}`}>
                {telemetry.vibration > 0.45 ? '▲ MODERATE RIPPLE' : '● Low'}
              </p>
            </div>

            {/* Fuel Consumption */}
            <div className="p-3 rounded-xl bg-navy-900/80 border border-cyan-500/20">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Fuel Consumption</span>
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-xl font-tech font-bold text-white mt-1">{telemetry.fuelConsumption} L/h</p>
              <p className="text-[10px] text-emerald-400 font-mono-code mt-0.5">● Optimized</p>
            </div>

            {/* Engine Load */}
            <div className="p-3 rounded-xl bg-navy-900/80 border border-cyan-500/20">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Engine Load</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-xl font-tech font-bold text-white mt-1">{telemetry.engineLoad}%</p>
              <p className="text-[10px] text-emerald-400 font-mono-code mt-0.5">● Cruise Thrust</p>
            </div>

            {/* Exhaust Temp */}
            <div className="p-3 rounded-xl bg-navy-900/80 border border-cyan-500/20">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Exhaust Temp</span>
                <Flame className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <p className="text-xl font-tech font-bold text-white mt-1">{telemetry.exhaustTemp}°C</p>
              <p className="text-[10px] text-emerald-400 font-mono-code mt-0.5">● Within threshold</p>
            </div>

            {/* Operating Hours */}
            <div className="p-3 rounded-xl bg-navy-900/80 border border-cyan-500/20">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Operating Hours</span>
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-xl font-tech font-bold text-white mt-1">{telemetry.operatingHours} h</p>
              <p className="text-[10px] text-cyan-400 font-mono-code mt-0.5">● Flight Log Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Live Engine Health Trend Chart & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Health Trend Chart (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-tech text-sm font-bold text-white flex items-center gap-2">
              <LineChart className="w-4 h-4 text-cyan-400" />
              LIVE ENGINE HEALTH TREND SCORE
            </h3>
            <span className="text-xs font-mono-code text-cyan-400">REAL-TIME STREAM</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={history.length > 0 ? history : [{ time: '12:00', healthScore: 86 }]}>
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#060a17', borderColor: '#00f0ff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="healthScore" stroke="#00f0ff" strokeWidth={2.5} dot={false} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts Feed (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-tech text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              RECENT ENGINE ALERTS
            </h3>
            <button
              onClick={() => setActiveTab('ai')}
              className="text-xs text-cyan-400 hover:underline font-subtech flex items-center gap-1"
            >
              AI Diagnostics <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {alerts.slice(0, 3).map((a) => (
              <div key={a.id} className="p-3 rounded-xl bg-navy-950/70 border border-cyan-500/10 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-tech font-bold text-amber-300">{a.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono-code">{a.timestamp}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
