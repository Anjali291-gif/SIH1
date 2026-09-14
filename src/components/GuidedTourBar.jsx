import React, { useState } from 'react';
import { Volume2, SkipForward, SkipBack, StopCircle, Radio, Pause, Play, Clock, Minimize2, Maximize2 } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const GuidedTourBar = () => {
  const { 
    demoMode, 
    tourStep, 
    totalTourSteps, 
    tourText, 
    nextTourStep, 
    prevTourStep, 
    stopDemoMode,
    isTourPaused,
    togglePauseTour,
    tourPace,
    setTourPace
  } = useTelemetry();

  const [isMinimized, setIsMinimized] = useState(false);

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

  // If minimized: ultra-compact floating mini-pill at bottom right
  if (isMinimized) {
    return (
      <div className="fixed bottom-3 right-4 z-50 pointer-events-auto animate-fade-in">
        <div className="flex items-center gap-2 bg-navy-950/90 backdrop-blur-xl border border-cyan-400/50 px-3 py-2 rounded-2xl shadow-glow-cyan text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400 font-tech font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>STEP {tourStep}/{totalTourSteps}</span>
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
            className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title="Expand Subtitle Bar"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 inset-x-3 max-w-4xl mx-auto z-50 pointer-events-auto animate-fade-in">
      {/* Sleek, thin translucent bottom HUD subtitle bar */}
      <div 
        className="relative rounded-2xl border backdrop-blur-xl bg-navy-950/90 border-cyan-400/40 p-3 shadow-2xl overflow-hidden"
        style={{
          boxShadow: '0 -4px 30px rgba(0, 240, 255, 0.25), inset 0 0 15px rgba(0, 240, 255, 0.08)'
        }}
      >
        {/* Subtle glowing thin progress bar across top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-navy-900 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-electric-bright to-emerald-400 transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Compact Header Row */}
        <div className="flex items-center justify-between gap-2 mb-2 pt-0.5">
          {/* Left: Step badge + speaking pulse */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono-code bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold">
              <Radio className={`w-3 h-3 ${isTourPaused ? '' : 'animate-pulse text-cyan-400'}`} />
              STEP {tourStep}/{totalTourSteps}: {currentStepTitle}
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono-code text-slate-400">
              {isTourPaused ? '(Paused)' : 'Narrating live'}
            </span>
          </div>

          {/* Right: Quick action controls */}
          <div className="flex items-center gap-1.5">
            {/* Speed Pace Switch */}
            <div className="hidden md:flex items-center bg-navy-900/90 px-2 py-0.5 rounded-lg border border-cyan-500/20 text-[10px] font-mono-code">
              <Clock className="w-3 h-3 text-cyan-400 mr-1" />
              <button
                onClick={() => setTourPace('slow')}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  tourPace === 'slow' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Slow
              </button>
              <button
                onClick={() => setTourPace('normal')}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  tourPace === 'normal' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Normal
              </button>
            </div>

            {/* Pause / Resume Button */}
            <button
              onClick={togglePauseTour}
              className={`px-2.5 py-1 rounded-xl border text-[11px] font-tech font-bold flex items-center gap-1 transition-all ${
                isTourPaused 
                  ? 'bg-emerald-500 text-navy-950 border-emerald-400 shadow-[0_0_10px_#34d399]' 
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
              onClick={prevTourStep}
              disabled={tourStep <= 1}
              className={`p-1.5 rounded-xl border text-xs transition-all ${
                tourStep <= 1 
                  ? 'opacity-20 cursor-not-allowed border-slate-800 text-slate-600' 
                  : 'bg-navy-900 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
              }`}
              title="Previous Step"
            >
              <SkipBack className="w-3 h-3" />
            </button>

            {/* Next Step */}
            <button
              onClick={nextTourStep}
              className="px-2.5 py-1 rounded-xl border border-cyan-400/50 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-tech font-bold flex items-center gap-1 transition-all"
              title="Skip to Next Step"
            >
              Next
              <SkipForward className="w-3 h-3" />
            </button>

            {/* Minimize Toggle Button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white"
              title="Minimize Bar"
            >
              <Minimize2 className="w-3 h-3 text-cyan-400" />
            </button>

            {/* Exit Tour */}
            <button
              onClick={stopDemoMode}
              className="px-2 py-1 rounded-xl border border-red-500/40 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-tech font-bold flex items-center gap-1 transition-all"
              title="Exit Demo Tour"
            >
              <StopCircle className="w-3 h-3" />
              Exit
            </button>
          </div>
        </div>

        {/* Live Spoken Subtitle Strip — Non-intrusive bottom caption style */}
        <div className="flex items-center gap-2 bg-navy-900/60 px-3 py-1.5 rounded-xl border border-cyan-500/20">
          <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
          <p className="text-xs sm:text-[13px] text-cyan-50 font-normal leading-snug line-clamp-2">
            "{tourText}"
          </p>
        </div>
      </div>
    </div>
  );
};
