import React from 'react';
import { AlertTriangle, X, CheckCircle2, ShieldAlert, Siren } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { audioService } from '../services/audioService';

export const AlertBanner = () => {
  const { alerts, acknowledgeAlert } = useTelemetry();
  const unacknowledged = alerts.filter(a => !a.acknowledged);
  if (unacknowledged.length === 0) return null;

  const current = unacknowledged[0];
  const isEmergency = current.severity === 'emergency';
  const isCritical = current.severity === 'critical';

  const handleAcknowledge = () => {
    acknowledgeAlert(current.id);
    audioService.stopSiren();
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-md w-full rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all ${
      isEmergency
        ? 'bg-red-950/95 border-red-400 animate-pulse'
        : isCritical
        ? 'bg-amber-950/95 border-amber-500'
        : 'bg-yellow-950/95 border-yellow-500'
    }`}
    style={{
      boxShadow: isEmergency
        ? '0 0 40px rgba(239,68,68,0.8), inset 0 0 20px rgba(239,68,68,0.2)'
        : isCritical
        ? '0 0 30px rgba(245,158,11,0.6)'
        : '0 0 20px rgba(234,179,8,0.4)'
    }}
    >
      {/* Emergency red strobe border */}
      {isEmergency && (
        <div className="absolute inset-0 rounded-2xl border-4 border-red-500 animate-ping opacity-30 pointer-events-none" />
      )}

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
              isEmergency ? 'bg-red-500/30 text-red-300' :
              isCritical ? 'bg-amber-500/20 text-amber-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {isEmergency
                ? <ShieldAlert className="w-7 h-7 animate-bounce" />
                : <AlertTriangle className="w-6 h-6 animate-pulse" />
              }
            </div>

            <div className="flex-1 space-y-1">
              {/* Severity Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-tech font-bold tracking-wider ${
                  isEmergency ? 'bg-red-500 text-white' :
                  isCritical ? 'bg-amber-500 text-navy-950' :
                  'bg-yellow-500 text-navy-950'
                }`}>
                  {isEmergency ? '🚨 EMERGENCY' : isCritical ? '⚠ CRITICAL' : '⚡ WARNING'} ALERT
                </span>
                <span className="text-[11px] font-mono-code text-slate-300">{current.timestamp}</span>
              </div>

              <h4 className="font-tech text-sm font-bold text-white leading-snug">{current.title}</h4>
              <p className="text-xs text-slate-200 leading-relaxed">{current.description}</p>

              {isEmergency && (
                <div className="mt-2 p-2 rounded-lg bg-red-500/20 border border-red-500/40">
                  <p className="text-[11px] font-tech font-bold text-red-300 animate-pulse">
                    ⚡ IMMEDIATE ACTION: Abort mission! Activate emergency landing protocol! 
                    Stop engine immediately to prevent catastrophic failure!
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAcknowledge}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white shrink-0"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom action row */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono-code text-slate-300">
            {isEmergency
              ? 'ACTION: ABORT MISSION — EMERGENCY LANDING'
              : isCritical
              ? 'ACTION: Inspect cooling system & oil pressure'
              : 'ACTION: Monitor engine parameters closely'
            }
          </span>

          <button
            onClick={handleAcknowledge}
            className={`px-4 py-1.5 rounded-xl text-xs font-tech font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              isEmergency
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : isCritical
                ? 'bg-amber-500 hover:bg-amber-600 text-navy-950'
                : 'bg-yellow-500 hover:bg-yellow-600 text-navy-950'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
