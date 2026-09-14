import React from 'react';
import { Box, Activity, ShieldCheck, RefreshCw, Flame, Droplet, Wind, Gauge, AlertTriangle } from 'lucide-react';
import { Engine3DView } from '../components/Engine3DView';
import { useTelemetry } from '../context/TelemetryContext';

export const DigitalTwin = () => {
  const { telemetry } = useTelemetry();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-cyan-500/20">
        <div>
          <h2 className="text-2xl font-tech font-bold text-white tracking-wide flex items-center gap-2">
            <Box className="w-6 h-6 text-cyan-400" />
            Interactive 3D Digital Twin
          </h2>
          <p className="text-xs text-slate-400 font-subtech mt-0.5">
            Full 360° WebGL interactive digital twin of MALE UAV Aero Piston Engine with real-time component thermal warning glow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono-code flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            LIVE TELEMETRY SYNCED
          </span>
        </div>
      </div>

      {/* Main 3D Digital Twin Visualizer Component */}
      <Engine3DView />

      {/* Technical Component Diagnostic Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-5 rounded-2xl glass-panel border transition-all ${
          telemetry.temperature > 84 ? 'border-red-500/50 bg-red-500/10 shadow-glow-red' : 'border-cyan-500/20'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-tech text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              CYLINDER HEAD THERMAL ZONE
            </h3>
            <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded ${
              telemetry.temperature > 84 ? 'bg-red-500 text-white font-bold animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {telemetry.temperature > 84 ? 'WARNING GLOW ACTIVE' : 'NOMINAL'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Monitors cylinder head thermal gradients and cooling fin dissipation. Elevated readings trigger red thermal hotspot highlights on the 3D model.
          </p>
        </div>

        <div className={`p-5 rounded-2xl glass-panel border transition-all ${
          telemetry.vibration > 0.45 ? 'border-amber-500/50 bg-amber-500/10 shadow-glow-amber' : 'border-cyan-500/20'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-tech text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              CRANKCASE VIBRATION HUB
            </h3>
            <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded ${
              telemetry.vibration > 0.45 ? 'bg-amber-500 text-navy-950 font-bold animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {telemetry.vibration > 0.45 ? 'AMBER VIB PULSE' : 'NOMINAL'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tracks crankshaft mechanical rotational harmonics. High vibration amplitude triggers amber mechanical pulsing on the 3D main crankcase block.
          </p>
        </div>

        <div className={`p-5 rounded-2xl glass-panel border transition-all ${
          telemetry.oilPressure < 3.4 ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-cyan-500/20'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-tech text-sm font-bold text-white flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              LUBRICATION OIL PUMP
            </h3>
            <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded ${
              telemetry.oilPressure < 3.4 ? 'bg-yellow-500 text-navy-950 font-bold' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {telemetry.oilPressure < 3.4 ? 'LOW PRESSURE' : 'NOMINAL'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Direct telemetry feed from oil pressure transducer. Low pressure activates yellow warning indicators on the bottom pump housing assembly.
          </p>
        </div>
      </div>
    </div>
  );
};
