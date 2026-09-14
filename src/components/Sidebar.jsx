import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Activity, 
  BrainCircuit, 
  Box, 
  LineChart, 
  Wrench, 
  Sliders, 
  FileSpreadsheet, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const Sidebar = () => {
  const { activeTab, setActiveTab, telemetry } = useTelemetry();

  const menuItems = [
    { id: 'home', label: 'Home Overview', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live Monitoring', icon: Activity },
    { id: 'ai', label: 'AI Analysis', icon: BrainCircuit },
    { id: 'twin', label: '3D Digital Twin', icon: Box, highlight: true },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'simulation', label: 'Simulation / What-If', icon: Sliders },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-navy-950/90 border-r border-cyan-500/20 p-4 flex flex-col justify-between backdrop-blur-xl shrink-0">
      <div className="space-y-6">
        {/* Navigation Group Title */}
        <div>
          <p className="px-3 text-[10px] font-tech font-bold uppercase tracking-widest text-cyan-400/70 mb-2">
            MISSION COMMAND NAVIGATION
          </p>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-electric-bright/20 to-cyan-500/20 text-white border border-cyan-400/50 shadow-glow-cyan'
                      : 'text-slate-400 hover:text-white hover:bg-navy-850/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                    }`} />
                    <span className="font-tech tracking-wide">{item.label}</span>
                  </div>

                  {item.highlight && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-tech bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                      3D
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tactical UAV Telemetry Mini Status Badge */}
        <div className="p-3.5 rounded-2xl glass-panel border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-tech font-bold text-slate-400">ACTIVE UAV TELEMETRY</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white font-mono-code font-bold">MALE UAV E-001</span>
            <span className="text-emerald-400 font-tech font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ONLINE
            </span>
          </div>
          <div className="pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-slate-400 font-mono-code">
            <span>HEALTH: <strong className="text-cyan-300">{telemetry.healthScore}%</strong></span>
            <span>RUL: <strong className="text-cyan-300">{telemetry.rulHours}h</strong></span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-cyan-500/15 text-[11px] text-slate-400 text-center">
        <p className="font-tech text-cyan-400/80">DRDO PS 26054</p>
        <p className="text-[10px] font-mono-code mt-0.5">UAV Aero Engine Twin v2.4</p>
      </div>
    </aside>
  );
};
