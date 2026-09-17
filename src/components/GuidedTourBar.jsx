import React, { useState } from 'react';
import { 
  Volume2, 
  SkipForward, 
  SkipBack, 
  StopCircle, 
  Radio, 
  Pause, 
  Play, 
  Clock, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  Activity, 
  Box, 
  Cpu, 
  AlertTriangle 
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { audioService } from '../services/audioService';

export const GuidedTourBar = () => {
  const { 
    demoMode, 
    demoStage,
    tourStep, 
    totalTourSteps, 
    tourText, 
    tourStepsList,
    nextTourStep, 
    prevTourStep, 
    jumpToTourStep,
    stopDemoMode,
    isTourPaused,
    togglePauseTour,
    tourPace,
    setTourPace
  } = useTelemetry();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickJumps, setShowQuickJumps] = useState(false);

  if (!demoMode || tourStep === 0) return null;

  const progressPercent = Math.round((tourStep / totalTourSteps) * 100);

  const stepTitles = [
    '',
    'HOME OVERVIEW',
    'EXECUTIVE DASHBOARD',
    '3D DIGITAL TWIN',
    'LIVE SENSORS',
    'DIAGNOSTICS & PREDICTIONS',
    'WHAT-IF SIMULATION',
    'ALERTS & SIREN',
    'MAINTENANCE CHECKLIST',
    'MISSION REPORTS'
  ];

  const currentStepTitle = stepTitles[tourStep] || `STEP ${tourStep}`;

  // Replay speech narration
  const handleReplayNarration = () => {
    audioService.stopVoice();
    audioService.speakTourNarration(tourText, null, tourPace === 'slow' ? 0.84 : 0.92);
  };

  // Stage Jumpers: 1 (Healthy), 2 (Warning), 3 (Critical), 4 (Emergency)
  const stages = [
    { num: 1, label: 'Nominal Flight', step: 2, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    { num: 2, label: 'Thermal Warning', step: 5, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    { num: 3, label: 'Critical Wear', step: 8, color: 'text-orange-400 border-orange-500/40 bg-orange-500/10' },
    { num: 4, label: '🚨 Emergency Siren', step: 7, color: 'text-red-400 border-red-500/60 bg-red-500/20' },
  ];

  // If minimized: ultra-compact floating mini-pill at bottom right
  if (isMinimized) {
    return (
      <div className="fixed bottom-3 right-4 z-50 pointer-events-auto animate-fade-in">
        <div className="flex items-center gap-2 bg-navy-950/95 backdrop-blur-2xl border border-cyan-400/60 px-3 py-2 rounded-2xl shadow-glow-cyan text-xs">
          <div className="flex items-center gap-1.5 text-cyan-300 font-tech font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>DEMO {tourStep}/{totalTourSteps}</span>
          </div>

          <button
            onClick={togglePauseTour}
            className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
            title={isTourPaused ? "Resume" : "Pause"}
          >
            {isTourPaused ? <Play className="w-3.5 h-3.5 fill-cyan-300" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={nextTourStep}
            className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
            title="Next Step"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={stopDemoMode}
            className="p-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
            title="Exit Tour"
          >
            <StopCircle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:text-white"
            title="Expand Full Presentation HUD"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 inset-x-3 max-w-5xl mx-auto z-50 pointer-events-auto animate-fade-in">
      {/* Sleek, attractive translucent bottom HUD presentation bar */}
      <div 
        className="relative rounded-2xl border backdrop-blur-2xl bg-navy-950/95 border-cyan-400/50 p-3.5 shadow-2xl overflow-hidden space-y-2.5"
        style={{
          boxShadow: '0 -8px 40px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.08)'
        }}
      >
        {/* Subtle glowing thin progress bar across top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-navy-900 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-electric-bright to-emerald-400 transition-all duration-700 shadow-[0_0_10px_#00f0ff]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Top Control & Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          {/* Left: Step Info, Waveform & Stage Badge */}
          <div className="flex items-center gap-2">
            {/* Live Audio Equalizer Waveform */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              <span className="w-1 bg-cyan-400 rounded-full h-3 animate-pulse" />
              <span className="w-1 bg-cyan-300 rounded-full h-4.5 animate-pulse" style={{ animationDelay: '0.15s' }} />
              <span className="w-1 bg-electric-bright rounded-full h-2.5 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span className="w-1 bg-emerald-400 rounded-full h-3.5 animate-pulse" style={{ animationDelay: '0.45s' }} />
            </div>

            {/* Step & Title */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 border border-cyan-400/50 font-bold tracking-wider">
                  STEP {tourStep}/{totalTourSteps}
                </span>
                <span className="font-tech text-xs font-bold text-white tracking-wide truncate max-w-[200px] sm:max-w-none">
                  {currentStepTitle}
                </span>
              </div>
            </div>
          </div>

          {/* Center / Right: Interactive Stage Jumpers & Action Controls */}
          <div className="flex items-center gap-1.5">
            {/* Interactive Stage Jump Chips for Presentation */}
            <div className="hidden lg:flex items-center gap-1 bg-navy-900/90 px-1.5 py-0.5 rounded-xl border border-cyan-500/20 text-[10px] font-tech font-bold">
              <span className="text-slate-400 text-[9px] mr-1">STAGE:</span>
              {stages.map((stg) => (
                <button
                  key={stg.num}
                  type="button"
                  onClick={() => jumpToTourStep(stg.step)}
                  className={`px-2 py-0.5 rounded-lg border transition-all ${stg.color} ${
                    demoStage === stg.num ? 'ring-1 ring-white/40 scale-105 font-black' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={`Jump to ${stg.label}`}
                >
                  {stg.label}
                </button>
              ))}
            </div>

            {/* Replay Narration Voice Button */}
            <button
              type="button"
              onClick={handleReplayNarration}
              className="p-1.5 rounded-xl border border-cyan-500/30 bg-navy-900 text-cyan-300 hover:bg-cyan-500/20 text-xs transition-all"
              title="Replay Spoken Audio Explanation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Pause / Resume Button */}
            <button
              type="button"
              onClick={togglePauseTour}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-tech font-bold flex items-center gap-1 transition-all ${
                isTourPaused 
                  ? 'bg-emerald-500 text-navy-950 border-emerald-400 shadow-[0_0_12px_#34d399]' 
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
              }`}
            >
              {isTourPaused ? (
                <>
                  <Play className="w-3 h-3 fill-navy-950" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3" />
                  Pause
                </>
              )}
            </button>

            {/* Prev Step */}
            <button
              type="button"
              onClick={prevTourStep}
              disabled={tourStep <= 1}
              className={`p-1.5 rounded-xl border text-xs transition-all ${
                tourStep <= 1 
                  ? 'opacity-20 cursor-not-allowed border-slate-800 text-slate-600' 
                  : 'bg-navy-900 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
              }`}
              title="Previous Step"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            {/* Next Step */}
            <button
              type="button"
              onClick={nextTourStep}
              className="px-2.5 py-1.5 rounded-xl border border-cyan-400/60 bg-gradient-to-r from-cyan-500/30 to-electric-bright/30 hover:brightness-125 text-cyan-200 text-[11px] font-tech font-bold flex items-center gap-1 transition-all shadow-glow-cyan"
              title="Skip to Next Step"
            >
              Next
              <SkipForward className="w-3 h-3" />
            </button>

            {/* Quick Page Jump Toggle */}
            <button
              type="button"
              onClick={() => setShowQuickJumps(!showQuickJumps)}
              className={`px-2 py-1.5 rounded-xl border text-[10px] font-tech font-bold transition-all ${
                showQuickJumps ? 'bg-cyan-500 text-navy-950 border-cyan-400' : 'bg-navy-900 border-cyan-500/30 text-cyan-300'
              }`}
              title="Show 9 Steps Quick Navigator"
            >
              {showQuickJumps ? 'Close Jumps' : 'All Steps ⚡'}
            </button>

            {/* Minimize Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white"
              title="Minimize HUD"
            >
              <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {/* Exit Tour */}
            <button
              type="button"
              onClick={stopDemoMode}
              className="px-2.5 py-1.5 rounded-xl border border-red-500/40 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-tech font-bold flex items-center gap-1 transition-all"
              title="Exit Demo Tour"
            >
              <StopCircle className="w-3 h-3" />
              Exit
            </button>
          </div>
        </div>

        {/* Expandable Quick Steps Jumper Bar (When user clicks All Steps) */}
        {showQuickJumps && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-[10px] font-tech font-bold border-t border-cyan-500/20">
            {stepTitles.slice(1).map((title, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { jumpToTourStep(i + 1); setShowQuickJumps(false); }}
                className={`px-2 py-1 rounded-lg border whitespace-nowrap transition-all ${
                  tourStep === i + 1 
                    ? 'bg-cyan-500 text-navy-950 border-cyan-300 font-black shadow-glow-cyan' 
                    : 'bg-navy-900/90 border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-400'
                }`}
              >
                {i + 1}. {title}
              </button>
            ))}
          </div>
        )}

        {/* Live Spoken Subtitle Strip — Non-intrusive bottom caption style */}
        <div className="flex items-center gap-2.5 bg-navy-900/80 px-3 py-1.5 rounded-xl border border-cyan-500/30 shadow-inner">
          <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
          <p className="text-xs sm:text-[13px] text-cyan-100 font-normal leading-snug line-clamp-2">
            "{tourText}"
          </p>
        </div>
      </div>
    </div>
  );
};
