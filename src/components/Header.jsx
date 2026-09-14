import React, { useState } from 'react';
import { Shield, Bell, Volume2, VolumeX, Play, StopCircle, User, LogOut, AlertTriangle, Radio, ShieldAlert } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { useAuth } from '../context/AuthContext';
import { audioService } from '../services/audioService';

export const Header = () => {
  const { telemetry, activeTab, setActiveTab, alerts, demoMode, demoStage, startDemoMode, stopDemoMode, acknowledgeAlert } = useTelemetry();
  const { user, logout } = useAuth();

  const [soundOn, setSoundOn] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const isEmergency = telemetry.status === 'Emergency';
  const isCritical = telemetry.status === 'Critical';

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    audioService.setSoundEnabled(next);
    if (!next) audioService.stopSiren();
  };

  // Demo stage display config
  const stageConfig = {
    1: { label: 'STAGE 1 — HEALTHY', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/50' },
    2: { label: 'STAGE 2 — WARNING', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/50' },
    3: { label: 'STAGE 3 — CRITICAL', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/50' },
    4: { label: '🚨 STAGE 4 — EMERGENCY', color: 'text-red-300 animate-pulse', bg: 'bg-red-900/60 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)]' },
  };
  const sc = stageConfig[demoStage] || stageConfig[1];

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b px-4 lg:px-8 py-3 transition-all ${
      isEmergency
        ? 'bg-red-950/90 border-red-500/60'
        : 'bg-navy-950/85 border-cyan-500/20'
    }`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-3 focus:outline-none group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-electric-bright to-cyan-400 p-0.5 shadow-glow-cyan group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                {isEmergency
                  ? <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
                  : <Shield className="w-5 h-5 text-cyan-400" />
                }
              </div>
            </div>
            <div>
              <h1 className="font-tech text-base lg:text-lg font-black tracking-wider text-white">
                UAV ENGINE <span className="text-cyan-400">DIGITAL TWIN</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-subtech tracking-wide hidden sm:block">
                Defense Aero Engine Platform
              </p>
            </div>
          </button>

          {isEmergency && (
            <div className="hidden lg:flex items-center gap-2 bg-red-500/20 border border-red-500/60 px-3 py-1 rounded-full animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span className="text-xs font-tech font-bold text-red-400">⚠ EMERGENCY — CATASTROPHIC FAILURE</span>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2.5">

          {/* Demo Mode Button */}
          {demoMode ? (
            <div className="flex items-center gap-2">
              {/* Stage Indicator */}
              <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-tech font-bold ${sc.bg} ${sc.color}`}>
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                {sc.label}
              </div>
              <button
                onClick={stopDemoMode}
                className="px-3 py-1.5 rounded-xl text-xs font-tech font-bold flex items-center gap-1.5 bg-slate-800 border border-slate-600 text-slate-300 hover:text-white transition-all"
              >
                <StopCircle className="w-4 h-4" />
                STOP DEMO
              </button>
            </div>
          ) : (
            <button
              onClick={startDemoMode}
              className="px-3 py-1.5 rounded-xl text-xs font-tech font-bold flex items-center gap-1.5 bg-gradient-to-r from-electric-bright to-cyan-500 text-navy-950 border border-cyan-400 shadow-glow-cyan hover:brightness-110 transition-all"
            >
              <Play className="w-4 h-4 fill-navy-950" />
              HACKATHON DEMO
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundOn ? 'bg-navy-850 border-cyan-500/30 text-cyan-400' : 'bg-navy-900 border-slate-700 text-slate-500'
            }`}
            title={soundOn ? 'Audio ON (click to mute)' : 'Audio MUTED'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 border rounded-xl transition-colors ${
                unacknowledgedAlerts.some(a => a.severity === 'emergency')
                  ? 'bg-red-500/20 border-red-500/60 text-red-400'
                  : 'bg-navy-850 border-cyan-500/30 text-slate-300'
              }`}
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              {unacknowledgedAlerts.length > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-white font-bold text-[10px] flex items-center justify-center shadow-glow-red ${
                  unacknowledgedAlerts.some(a => a.severity === 'emergency') ? 'bg-red-500 animate-ping' : 'bg-red-500 animate-bounce'
                }`}>
                  {unacknowledgedAlerts.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-navy-900 border border-cyan-500/30 rounded-2xl shadow-2xl z-50 p-4 backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3">
                  <h4 className="font-tech text-sm font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    LIVE ALERTS ({alerts.length})
                  </h4>
                  <button onClick={() => setShowNotifications(false)} className="text-xs text-slate-400 hover:text-white">Close</button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {alerts.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No alerts triggered.</p>
                  ) : (
                    alerts.map((a) => (
                      <div key={a.id} className={`p-2.5 rounded-xl border text-xs ${
                        a.severity === 'emergency' ? 'bg-red-900/60 border-red-500/60 text-red-100' :
                        a.severity === 'critical' ? 'bg-amber-950/60 border-amber-500/40 text-amber-200' :
                        'bg-navy-950 border-cyan-500/20 text-slate-300'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold truncate">{a.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{a.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-2">{a.description}</p>
                        {!a.acknowledged && (
                          <button
                            onClick={() => { acknowledgeAlert(a.id); audioService.stopSiren(); }}
                            className="mt-1.5 text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 pl-2.5 bg-navy-850 hover:bg-cyan-500/10 border border-cyan-500/30 rounded-xl transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-cyan-400 font-mono-code leading-tight">Engineer</p>
              </div>
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover border border-cyan-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-navy-900 border border-cyan-500/30 rounded-2xl shadow-2xl z-50 p-4 backdrop-blur-2xl">
                <div className="pb-3 border-b border-cyan-500/20 mb-3">
                  <p className="font-tech text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-cyan-400 font-mono-code truncate">{user.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 rounded">{user.clearanceLevel}</span>
                </div>
                <div className="space-y-1">
                  <button onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-cyan-400" /> Account Settings
                  </button>
                  <button onClick={() => { logout(); setActiveTab('login'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
