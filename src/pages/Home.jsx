import React from 'react';
import { Shield, ArrowRight, Activity, BrainCircuit, Box, Wrench, Play } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const Home = () => {
  const { setActiveTab, startDemoMode, telemetry } = useTelemetry();

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Health Monitoring',
      desc: 'Instant streaming telemetry across 8 critical engine sensor channels with zero-latency telemetry pipelines.'
    },
    {
      icon: BrainCircuit,
      title: 'Predictive Fault Detection',
      desc: 'Predictive XGBoost and neural network anomaly detection pinpointing overheating, bearing wear, and oil loss.'
    },
    {
      icon: Box,
      title: '3D Digital Twin Model',
      desc: 'Interactive 3D aero propulsion engine visualization across 3 view layers with dynamic thermal and mechanical warning component glows.'
    },
    {
      icon: Wrench,
      title: 'RUL & Predictive Maintenance',
      desc: 'Remaining Useful Life estimation models prescribing actionable maintenance checklists before failure occurs.'
    }
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:py-12 space-y-16">
      {/* Hero Section — Full Width */}
      <div className="max-w-4xl space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-tech font-bold tracking-widest text-cyan-400 uppercase">
              SIH 26054 — DEFENSE AERO ENGINE DIGITAL TWIN PLATFORM
            </p>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black font-tech tracking-tight text-white leading-none">
              MALE UAV Aero Engine <br />
              <span className="bg-gradient-to-r from-cyan-400 via-electric-bright to-blue-500 bg-clip-text text-transparent neon-text-cyan">
                Digital Twin System
              </span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            Real-time engine health monitoring, predictive fault detection, and remaining useful life estimation for safer, mission-critical MALE UAV operations.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-electric-bright to-cyan-400 text-navy-950 font-tech font-bold text-sm tracking-wide shadow-glow-cyan hover:brightness-110 transition-all flex items-center gap-2 group"
            >
              Explore Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('twin')}
              className="px-6 py-3.5 rounded-2xl bg-navy-900/90 hover:bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-tech font-bold text-sm tracking-wide transition-all flex items-center gap-2"
            >
              <Box className="w-4 h-4 text-cyan-400" />
              Launch 3D Digital Twin
            </button>

            <button
              onClick={startDemoMode}
              className="px-5 py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-tech font-bold text-xs tracking-wide transition-all flex items-center gap-2 shadow-glow-amber"
            >
              <Play className="w-3.5 h-3.5 fill-amber-300" />
              Automated Guided Demo Tour
            </button>
          </div>

          {/* Key Stat Counters Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cyan-500/20">
            <div>
              <p className="text-2xl font-tech font-bold text-white">99.4%</p>
              <p className="text-xs text-slate-400 font-subtech">Prediction Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-tech font-bold text-cyan-400">&lt; 50ms</p>
              <p className="text-xs text-slate-400 font-subtech">Telemetry Latency</p>
            </div>
            <div>
              <p className="text-2xl font-tech font-bold text-emerald-400">42 Hours</p>
              <p className="text-xs text-slate-400 font-subtech">Early Warning Horizon</p>
            </div>
          </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-tech font-bold text-white">
            Next-Generation Aero Defense Capabilities
          </h2>
          <p className="text-sm text-slate-300">
            Purpose-built architecture addressing DRDO SIH Problem Statement 26054 for high-altitude MALE UAVs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel glass-panel-hover border border-cyan-500/20 space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-electric-bright/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-tech text-base font-bold text-white">{f.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
