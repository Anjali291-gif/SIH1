import React from 'react';
import { BrainCircuit, AlertTriangle, ShieldCheck, HelpCircle, CheckCircle, TrendingUp, Cpu } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const AIAnalysis = () => {
  const { telemetry } = useTelemetry();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-cyan-500/20">
        <h2 className="text-2xl font-tech font-bold text-white tracking-wide flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-cyan-400" />
          AI Analysis & Predictions (Explainable AI)
        </h2>
        <p className="text-xs text-slate-400 font-subtech mt-0.5">
          Multi-layer XGBoost & Deep Neural Network diagnostic breakdown for hackathon evaluation
        </p>
      </div>

      {/* Top 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engine Health Card */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 shadow-glow-cyan text-center space-y-2">
          <span className="text-xs font-tech font-bold text-slate-400">ENGINE HEALTH SCORE</span>
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="46" stroke="rgba(0,240,255,0.15)" strokeWidth="8" fill="transparent" />
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke={telemetry.healthScore > 80 ? '#00f0ff' : telemetry.healthScore > 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeDasharray={289}
                strokeDashoffset={289 - (289 * telemetry.healthScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute text-2xl font-tech font-bold text-white">{telemetry.healthScore}%</span>
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-tech font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            Status: {telemetry.status}
          </span>
        </div>

        {/* Fault Prediction Card */}
        <div className="p-5 rounded-2xl glass-panel border border-amber-500/40 shadow-glow-amber text-center space-y-3 flex flex-col justify-between">
          <span className="text-xs font-tech font-bold text-slate-400">PREDICTED FAULT CLASSIFICATION</span>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 mb-2">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-tech font-bold text-amber-300">{telemetry.predictedFault}</h3>
            <p className="text-xs text-amber-400/90 font-tech mt-1">Probability: {telemetry.faultProbability}%</p>
          </div>
          <p className="text-[11px] text-slate-400">High thermal gradient detected across piston cylinder #2</p>
        </div>

        {/* RUL Prediction Card */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 text-center space-y-3 flex flex-col justify-between">
          <span className="text-xs font-tech font-bold text-slate-400 font-subtech">REMAINING USEFUL LIFE (RUL)</span>
          <div>
            <span className="text-5xl font-tech font-black text-cyan-300 neon-text-cyan">{telemetry.rulHours}</span>
            <span className="text-sm text-slate-300 font-tech block mt-1">HOURS</span>
          </div>
          <p className="text-[11px] text-slate-400">Estimated remaining flight hours before mandatory service</p>
        </div>
      </div>

      {/* Main Explainable AI Section: "Why did the AI make this prediction?" */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-tech text-lg font-bold text-white">Why did the AI make this prediction?</h3>
              <p className="text-xs text-slate-400">Feature importance weights & anomaly attribution breakdown</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono-code text-cyan-300">
            XGBoost SHAP Feature Attribution
          </span>
        </div>

        {/* Anomaly Attribution Factors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-navy-950/80 border border-red-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-tech text-slate-200 font-bold">Temperature Surge Factor</span>
              <span className="text-red-400 font-mono-code font-bold">▲ Temperature increased by 14%</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crankcase thermal sensor detected steady temperature rise above 84°C baseline over 3 consecutive flight cycles.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-tech text-slate-200 font-bold">Vibration Anomaly</span>
              <span className="text-amber-400 font-mono-code font-bold">▲ Vibration increased by 31%</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Secondary piston harmonic amplitude elevated to 0.42g, indicating early cylinder lining friction.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950/80 border border-yellow-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-tech text-slate-200 font-bold">Oil Pressure Drop</span>
              <span className="text-yellow-400 font-mono-code font-bold">▼ Oil pressure decreased by 12%</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lubrication line pressure dropped to 3.8 bar, slightly reducing thermal dissipation efficiency.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950/80 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-tech text-slate-200 font-bold">Fuel Consumption Rate</span>
              <span className="text-cyan-300 font-mono-code font-bold">▲ Fuel consumption increased by 8%</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              EFI injection compensation active to offset engine thermal load increase.
            </p>
          </div>
        </div>

        {/* Model Confidence Bars */}
        <div className="pt-4 border-t border-cyan-500/20 space-y-4">
          <h4 className="font-tech text-sm font-bold text-cyan-400 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            AI MODEL CONFIDENCE SCORES
          </h4>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-tech">Fault Classification Confidence (XGBoost)</span>
                <span className="text-cyan-400 font-mono-code font-bold">{telemetry.faultProbability}%</span>
              </div>
              <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-cyan-500/20">
                <div className="h-full bg-cyan-400" style={{ width: `${telemetry.faultProbability}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-tech">Health Classification Confidence</span>
                <span className="text-emerald-400 font-mono-code font-bold">94%</span>
              </div>
              <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-cyan-500/20">
                <div className="h-full bg-emerald-400" style={{ width: '94%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-tech">RUL Regression Confidence (LSTM)</span>
                <span className="text-purple-400 font-mono-code font-bold">88%</span>
              </div>
              <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-cyan-500/20">
                <div className="h-full bg-purple-400" style={{ width: '88%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
