import React, { useState, useRef, useEffect } from 'react';
import { 
  RotateCw, ZoomIn, ZoomOut, RefreshCw, Layers, Eye, Box, 
  Activity, Flame, Wind, Gauge, Droplet, ShieldCheck, AlertTriangle, Radio
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const Engine3DView = () => {
  const { telemetry } = useTelemetry();

  // 3 View Layers requested by user:
  // 1: '3d' (3D Interactive Perspective View)
  // 2: 'internal' (Internal Cross-Section View with moving pistons & thermal combustion)
  // 3: 'normal' (Tactical Inspection View with sensor specs)
  const [viewLayer, setViewLayer] = useState('3d');
  
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationX, setRotationX] = useState(6);
  const [rotationY, setRotationY] = useState(12);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState(null);

  const containerRef = useRef(null);
  const animRef = useRef(null);

  const isTempHot = telemetry.temperature > 84;
  const isVibHigh = telemetry.vibration > 0.45;
  const isOilLow = telemetry.oilPressure < 3.4;
  const isEmergency = telemetry.status === 'Emergency';
  const isCritical = telemetry.status === 'Critical';

  // Smooth continuous auto-rotation in 3D
  useEffect(() => {
    let lastTime = performance.now();
    const loop = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (autoRotate && !isDragging) {
        setRotationY(prev => (prev + delta * 14) % 360);
      }
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [autoRotate, isDragging]);

  // Mouse drag controls for 3D rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotationY(prev => prev + deltaX * 0.45);
    setRotationX(prev => Math.max(-45, Math.min(45, prev - deltaY * 0.35)));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotationX(6);
    setRotationY(12);
    setZoom(1);
    setAutoRotate(true);
  };

  const handleZoom = (dir) => {
    if (dir === 'in') setZoom(z => Math.min(1.8, z + 0.15));
    if (dir === 'out') setZoom(z => Math.max(0.7, z - 0.15));
  };

  // 5 Hotspot markers pointing to key engine parts
  const hotspots = [
    {
      id: 'compressor',
      name: 'Intake Fan & Compressor',
      x: '15%',
      y: '52%',
      value: `${telemetry.rpm} RPM`,
      status: 'Nominal'
    },
    {
      id: 'combustion',
      name: 'Red Thermal Combustion Core',
      x: '38%',
      y: '50%',
      value: `${telemetry.temperature}°C`,
      status: isTempHot ? 'Thermal Alert' : 'Nominal',
      isThermal: true
    },
    {
      id: 'injector',
      name: 'Electronic Fuel Rail',
      x: '55%',
      y: '32%',
      value: `${telemetry.fuelConsumption} L/h`,
      status: 'Nominal'
    },
    {
      id: 'scavenge',
      name: 'Oil Scavenge Lubrication Pump',
      x: '58%',
      y: '80%',
      value: `${telemetry.oilPressure} bar`,
      status: isOilLow ? 'Pressure Drop' : 'Nominal'
    },
    {
      id: 'exhaust',
      name: 'Exhaust Turbine Vector',
      x: '84%',
      y: '50%',
      value: `${telemetry.exhaustTemp}°C`,
      status: 'Nominal'
    }
  ];

  return (
    <div 
      className="relative w-full rounded-2xl glass-panel border overflow-hidden flex flex-col lg:flex-row shadow-2xl transition-all"
      style={{
        borderColor: isEmergency ? '#ef4444' : isCritical ? '#f59e0b' : 'rgba(0, 240, 255, 0.3)',
        boxShadow: isEmergency 
          ? '0 0 35px rgba(239, 68, 68, 0.7), inset 0 0 20px rgba(239, 68, 68, 0.2)'
          : isCritical 
          ? '0 0 25px rgba(245, 158, 11, 0.5)' 
          : '0 0 25px rgba(0, 240, 255, 0.25)'
      }}
    >
      {/* Viewport Area */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative flex-1 min-h-[460px] cursor-grab active:cursor-grabbing flex items-center justify-center select-none overflow-hidden bg-navy-950/70"
      >
        {/* Emergency flashing strobe border */}
        {isEmergency && (
          <div className="absolute inset-0 z-30 pointer-events-none border-4 border-red-500 animate-pulse" />
        )}

        {/* Top Tactical HUD Bar */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
          <div className="bg-navy-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cyan-500/30 text-xs font-mono-code flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-red-500 animate-ping' : isCritical ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="font-tech font-bold text-white tracking-wider">AERO PROPULSION TWIN</span>
            <span className="text-cyan-400">|</span>
            <span className="text-slate-300">ROTAX 914-iS DIGITAL TWIN</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-navy-950/85 px-3 py-1.5 rounded-xl border border-cyan-500/20 text-[11px] font-mono-code text-cyan-300">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            LIVE 3D TELEMETRY SYNC
          </div>
        </div>

        {/* 3 View Layers Switcher Tabs */}
        <div className="absolute top-4 right-4 z-20 flex items-center bg-navy-950/90 p-1.5 rounded-2xl border border-cyan-500/30 backdrop-blur-md text-xs">
          <button
            onClick={() => setViewLayer('3d')}
            className={`px-3 py-1.5 rounded-xl font-tech font-bold flex items-center gap-1.5 transition-all ${
              viewLayer === '3d'
                ? 'bg-cyan-500 text-navy-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            Layer 1: 3D View
          </button>

          <button
            onClick={() => setViewLayer('internal')}
            className={`px-3 py-1.5 rounded-xl font-tech font-bold flex items-center gap-1.5 transition-all ${
              viewLayer === 'internal'
                ? 'bg-cyan-500 text-navy-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Layer 2: Internal View
          </button>

          <button
            onClick={() => setViewLayer('normal')}
            className={`px-3 py-1.5 rounded-xl font-tech font-bold flex items-center gap-1.5 transition-all ${
              viewLayer === 'normal'
                ? 'bg-cyan-500 text-navy-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Layer 3: Tactical Normal
          </button>
        </div>

        {/* ============================================================
            MAIN 3D AERO ENGINE OBJECT CONTAINER (2nd Uploaded Image)
        ============================================================ */}
        <div 
          className="relative w-full max-w-xl h-80 flex items-center justify-center pointer-events-none transition-transform duration-100 ease-out"
          style={{
            transform: `perspective(1200px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Cyber Circular Holographic Floor Grid beneath engine */}
          <div 
            className="absolute -bottom-10 w-96 h-96 rounded-full border border-cyan-500/25 pointer-events-none"
            style={{
              transform: 'rotateX(80deg) translateZ(-60px)',
              background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, rgba(0,102,255,0.05) 50%, transparent 75%)',
              boxShadow: '0 0 40px rgba(0,240,255,0.2)'
            }}
          />

          {/* Rotating Holographic Intake Ring */}
          <div 
            className="absolute left-6 w-56 h-56 rounded-full border-2 border-dashed border-cyan-400/40 pointer-events-none animate-spin-slow"
            style={{
              transform: 'rotateY(75deg) translateZ(-20px)',
              boxShadow: '0 0 25px rgba(0,240,255,0.35)'
            }}
          />

          {/* Center Rotating HUD Ring around Combustion Core */}
          <div 
            className="absolute w-64 h-64 rounded-full border border-cyan-400/30 pointer-events-none"
            style={{
              transform: 'rotateY(75deg) translateZ(20px)',
              borderStyle: 'dashed'
            }}
          />

          {/* THE 2nd UPLOADED ENGINE IMAGE AS 3D MODEL */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/assets/engine_twin.jpg"
              alt="MALE UAV Aero Engine Digital Twin"
              className={`w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                viewLayer === 'internal' 
                  ? 'brightness-125 contrast-125' 
                  : viewLayer === 'normal' 
                  ? 'brightness-100' 
                  : 'brightness-110'
              }`}
              style={{
                filter: isEmergency
                  ? 'drop-shadow(0 0 35px rgba(239,68,68,0.9)) saturate(1.4)'
                  : isCritical
                  ? 'drop-shadow(0 0 25px rgba(245,158,11,0.8))'
                  : 'drop-shadow(0 0 20px rgba(0,240,255,0.4))'
              }}
            />

            {/* DYNAMIC THERMAL HOTSPOT GLOW (Red Combustion Chamber Section) */}
            <div 
              className={`absolute left-[34%] top-[30%] w-[18%] h-[40%] rounded-2xl pointer-events-none transition-all duration-500 ${
                isTempHot || isEmergency
                  ? 'bg-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.9)] animate-pulse'
                  : 'bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              }`}
              style={{
                mixBlendMode: 'screen',
                filter: 'blur(6px)'
              }}
            />

            {/* LAYER 2: INTERNAL VIEW OVERLAYS (Reciprocating Piston Motion & Fluid Flow) */}
            {viewLayer === 'internal' && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Simulated reciprocating pistons inside engine cylinder ports */}
                <div className="absolute left-[38%] top-[20%] flex flex-col items-center">
                  <div className="w-8 h-4 rounded bg-cyan-400/80 shadow-[0_0_15px_#00f0ff] animate-bounce" />
                  <span className="text-[8px] font-mono-code text-cyan-300 mt-1">PISTON #1</span>
                </div>
                <div className="absolute left-[46%] top-[20%] flex flex-col items-center">
                  <div className="w-8 h-4 rounded bg-cyan-400/80 shadow-[0_0_15px_#00f0ff] animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="text-[8px] font-mono-code text-cyan-300 mt-1">PISTON #2</span>
                </div>

                {/* Flow arrows for Fuel & Lubrication Oil */}
                <div className="absolute left-[52%] top-[65%] text-[9px] font-mono-code text-amber-300 flex items-center gap-1 bg-navy-950/80 px-2 py-0.5 rounded border border-amber-400/40">
                  <span className="animate-ping text-amber-400">●</span> OIL FLOW: {telemetry.oilPressure} bar
                </div>

                <div className="absolute left-[28%] top-[70%] text-[9px] font-mono-code text-cyan-300 flex items-center gap-1 bg-navy-950/80 px-2 py-0.5 rounded border border-cyan-400/40">
                  <span className="animate-pulse text-cyan-400">●</span> FUEL INJECTION: {telemetry.fuelConsumption} L/h
                </div>
              </div>
            )}

            {/* Holographic Laser Scanning Line traversing across engine in 3D */}
            <div 
              className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent pointer-events-none opacity-60"
              style={{
                left: `${(rotationY % 100)}%`,
                boxShadow: '0 0 15px #00f0ff'
              }}
            />
          </div>

          {/* Interactive Hotspot Callout Pins */}
          {hotspots.map((hs) => (
            <div
              key={hs.id}
              onClick={(e) => { e.stopPropagation(); setActiveHotspot(hs.id === activeHotspot ? null : hs.id); }}
              className="absolute pointer-events-auto z-20 cursor-pointer group"
              style={{ left: hs.x, top: hs.y }}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                hs.isThermal && isTempHot 
                  ? 'bg-red-500 shadow-glow-red animate-ping' 
                  : 'bg-cyan-500 shadow-glow-cyan hover:scale-125'
              }`}>
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Tooltip on hover or click */}
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-navy-950/95 border p-2 rounded-xl text-[10px] font-mono-code backdrop-blur-md shadow-2xl transition-all ${
                activeHotspot === hs.id || 'group-hover:opacity-100' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              } ${hs.isThermal && isTempHot ? 'border-red-500 text-red-200' : 'border-cyan-500/40 text-slate-200'}`}>
                <p className="font-tech font-bold text-white truncate">{hs.name}</p>
                <div className="flex justify-between mt-1 text-[9px]">
                  <span>Telemetry:</span>
                  <strong className={hs.isThermal && isTempHot ? 'text-red-400 font-bold' : 'text-cyan-300'}>{hs.value}</strong>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span>Status:</span>
                  <span className={hs.isThermal && isTempHot ? 'text-red-400 font-bold' : 'text-emerald-400'}>{hs.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Viewport Floating Bottom Controls */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-navy-950/85 p-2 rounded-2xl border border-cyan-500/30 backdrop-blur-md">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl text-xs font-tech font-bold flex items-center gap-1.5 transition-all ${
              autoRotate ? 'bg-cyan-500 text-navy-950 shadow-glow-cyan' : 'bg-navy-850 text-slate-300 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            {autoRotate ? '3D Rotation ON' : '3D Rotation PAUSED'}
          </button>

          <button onClick={() => handleZoom('in')} className="p-1.5 bg-navy-850 hover:bg-cyan-500/20 rounded-xl text-cyan-400" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => handleZoom('out')} className="p-1.5 bg-navy-850 hover:bg-cyan-500/20 rounded-xl text-cyan-400" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={resetView} className="p-1.5 bg-navy-850 hover:bg-cyan-500/20 rounded-xl text-cyan-400" title="Reset View">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Layer Info Badge Bottom Right */}
        <div className="absolute bottom-4 right-4 z-20 bg-navy-950/85 px-3 py-2 rounded-xl border border-cyan-500/20 text-right backdrop-blur-md">
          <p className="text-[10px] font-tech text-cyan-400 font-bold uppercase">
            {viewLayer === '3d' ? '3D PERSPECTIVE HOLOGRAPHIC MODE' : viewLayer === 'internal' ? 'X-RAY INTERNAL CROSS-SECTION' : 'TACTICAL INSPECTION MODE'}
          </p>
          <p className="text-[10px] font-mono-code text-slate-400">Click & drag to rotate in 3D</p>
        </div>
      </div>

      {/* Right Side: Live Parameter Telemetry Side Panel */}
      <div className="w-full lg:w-80 bg-navy-900/90 border-t lg:border-t-0 lg:border-l border-cyan-500/20 p-5 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
            <div>
              <h3 className="font-tech text-base font-bold text-white tracking-wide">AERO ENGINE TWIN</h3>
              <p className="text-xs text-cyan-400 font-mono-code">DRDO / ROTAX 914-iS</p>
            </div>
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold font-tech ${
              isEmergency ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-ping' :
              isCritical ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {isEmergency ? 'EMERGENCY' : telemetry.status.toUpperCase()}
            </div>
          </div>

          {/* Telemetry Parameter Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-navy-950/60 p-2.5 rounded-xl border border-cyan-500/10">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-cyan-400" /> RPM
              </span>
              <p className="text-base font-tech font-bold text-white mt-0.5">{telemetry.rpm}</p>
            </div>

            <div className={`p-2.5 rounded-xl border transition-colors ${
              isTempHot ? 'bg-red-500/15 border-red-500/50' : 'bg-navy-950/60 border-cyan-500/10'
            }`}>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> Temperature
              </span>
              <p className={`text-base font-tech font-bold mt-0.5 ${isTempHot ? 'text-red-400' : 'text-white'}`}>
                {telemetry.temperature}°C
              </p>
            </div>

            <div className={`p-2.5 rounded-xl border transition-colors ${
              isOilLow ? 'bg-amber-500/15 border-amber-500/50' : 'bg-navy-950/60 border-cyan-500/10'
            }`}>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Droplet className="w-3 h-3 text-cyan-400" /> Oil Pressure
              </span>
              <p className="text-base font-tech font-bold text-white mt-0.5">{telemetry.oilPressure} bar</p>
            </div>

            <div className={`p-2.5 rounded-xl border transition-colors ${
              isVibHigh ? 'bg-amber-500/15 border-amber-500/50' : 'bg-navy-950/60 border-cyan-500/10'
            }`}>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" /> Vibration
              </span>
              <p className="text-base font-tech font-bold text-white mt-0.5">{telemetry.vibration} g</p>
            </div>

            <div className="bg-navy-950/60 p-2.5 rounded-xl border border-cyan-500/10">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Wind className="w-3 h-3 text-cyan-400" /> Fuel Rate
              </span>
              <p className="text-base font-tech font-bold text-white mt-0.5">{telemetry.fuelConsumption} L/h</p>
            </div>

            <div className="bg-navy-950/60 p-2.5 rounded-xl border border-cyan-500/10">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Load
              </span>
              <p className="text-base font-tech font-bold text-white mt-0.5">{telemetry.engineLoad}%</p>
            </div>
          </div>
        </div>

        {/* Health Score & RUL summary */}
        <div className="mt-4 pt-3 border-t border-cyan-500/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-300 font-tech">ENGINE HEALTH SCORE</span>
            <span className="text-sm font-tech font-bold text-cyan-400">{telemetry.healthScore}%</span>
          </div>
          <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-cyan-500/30">
            <div
              className={`h-full transition-all duration-500 ${
                isEmergency ? 'bg-red-500 animate-pulse' :
                telemetry.healthScore > 80 ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' :
                telemetry.healthScore > 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                'bg-gradient-to-r from-red-600 to-red-400'
              }`}
              style={{ width: `${telemetry.healthScore}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono-code">
            <span>RUL: <strong className="text-cyan-300">{telemetry.rulHours} Hours</strong></span>
            <span>Fault: <strong className={isTempHot ? 'text-red-400' : 'text-amber-400'}>{telemetry.faultProbability}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
