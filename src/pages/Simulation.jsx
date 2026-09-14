import React, { useState } from 'react';
import { Sliders, Play, RotateCcw, AlertTriangle, ShieldCheck, Activity, LineChart } from 'lucide-react';
import { runScenarioSimulation } from '../services/api';
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const Simulation = () => {
  const [selectedScenario, setSelectedScenario] = useState('High Temperature');
  const [temperature, setTemperature] = useState(94);
  const [load, setLoad] = useState(75);
  const [rpm, setRpm] = useState(4700);
  const [duration, setDuration] = useState(5);

  const [simulationResult, setSimulationResult] = useState(() =>
    runScenarioSimulation('High Temperature', { temperature: 94, load: 75, rpm: 4700, duration: 5 })
  );

  const handleRunSimulation = () => {
    const res = runScenarioSimulation(selectedScenario, {
      temperature,
      load,
      rpm,
      duration
    });
    setSimulationResult(res);
  };

  const scenarios = ['Normal', 'High Temperature', 'High Load', 'High Altitude'];

  const selectPresetScenario = (sc) => {
    setSelectedScenario(sc);
    let t = 82, l = 68, r = 4520;
    if (sc === 'High Temperature') { t = 94; l = 75; r = 4700; }
    else if (sc === 'High Load') { t = 89; l = 92; r = 5100; }
    else if (sc === 'High Altitude') { t = 86; l = 84; r = 4850; }

    setTemperature(t);
    setLoad(l);
    setRpm(r);

    const res = runScenarioSimulation(sc, { temperature: t, load: l, rpm: r, duration });
    setSimulationResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-cyan-500/20">
        <h2 className="text-2xl font-tech font-bold text-white tracking-wide flex items-center gap-2">
          <Sliders className="w-6 h-6 text-cyan-400" />
          Simulation & What-If Stress Analysis
        </h2>
        <p className="text-xs text-slate-400 font-subtech mt-0.5">
          Simulate harsh operational conditions to predict engine health degradation and remaining useful life
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Operating Condition Selection & Sliders (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-panel border border-cyan-500/20 space-y-6">
          <div>
            <label className="text-xs font-tech font-bold text-slate-300 block mb-2">
              SELECT OPERATING SCENARIO PRESET:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {scenarios.map((sc) => (
                <button
                  key={sc}
                  onClick={() => selectPresetScenario(sc)}
                  className={`p-2.5 rounded-xl text-xs font-tech font-bold transition-all border ${
                    selectedScenario === sc
                      ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-glow-cyan'
                      : 'bg-navy-950 text-slate-400 border-cyan-500/20 hover:text-white'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Parameter Controls Sliders */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-tech">Target Temperature (°C)</span>
                <span className="text-amber-400 font-mono-code font-bold">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="65"
                max="110"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-navy-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-tech">Engine Load (%)</span>
                <span className="text-cyan-400 font-mono-code font-bold">{load}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={load}
                onChange={(e) => setLoad(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-navy-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-tech">Engine Speed (RPM)</span>
                <span className="text-cyan-400 font-mono-code font-bold">{rpm} RPM</span>
              </div>
              <input
                type="range"
                min="3800"
                max="5600"
                step="50"
                value={rpm}
                onChange={(e) => setRpm(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-navy-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-tech">Mission Duration (Hours)</span>
                <span className="text-cyan-400 font-mono-code font-bold">{duration} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-navy-950 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-electric-bright to-cyan-400 text-navy-950 font-tech font-bold text-sm tracking-wide shadow-glow-cyan hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-navy-950" />
            RUN SIMULATION
          </button>
        </div>

        {/* Right Output: Predicted Simulation Metrics & Comparison Graph (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Predicted Result Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl glass-panel border border-cyan-500/20">
              <span className="text-[11px] text-slate-400 font-tech">PREDICTED HEALTH</span>
              <p className="text-2xl font-tech font-bold text-cyan-300 mt-1">{simulationResult.predictedHealth}%</p>
            </div>

            <div className="p-3.5 rounded-2xl glass-panel border border-cyan-500/20">
              <span className="text-[11px] text-slate-400 font-tech">PREDICTED RUL</span>
              <p className="text-2xl font-tech font-bold text-white mt-1">{simulationResult.predictedRul} h</p>
            </div>

            <div className="p-3.5 rounded-2xl glass-panel border border-amber-500/30">
              <span className="text-[11px] text-slate-400 font-tech">POTENTIAL FAULT</span>
              <p className="text-xs font-tech font-bold text-amber-300 mt-1 truncate">{simulationResult.predictedFault}</p>
            </div>

            <div className="p-3.5 rounded-2xl glass-panel border border-red-500/30">
              <span className="text-[11px] text-slate-400 font-tech">RISK LEVEL</span>
              <p className={`text-base font-tech font-bold mt-1 ${
                simulationResult.riskLevel === 'Critical' ? 'text-red-400 animate-pulse' :
                simulationResult.riskLevel === 'High' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {simulationResult.riskLevel}
              </p>
            </div>
          </div>

          {/* Comparison Graph: Normal vs Selected Condition */}
          <div className="p-6 rounded-3xl glass-panel border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-tech text-sm font-bold text-white flex items-center gap-2">
                <LineChart className="w-4 h-4 text-cyan-400" />
                HEALTH DEGRADATION COMPARISON
              </h3>
              <span className="text-xs text-slate-400 font-mono-code">Normal vs {simulationResult.scenario}</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={simulationResult.timeline}>
                  <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#060a17', borderColor: '#00f0ff', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" name="Baseline Normal Condition" dataKey="normalHealth" stroke="#34d399" strokeWidth={2.5} />
                  <Line type="monotone" name={`Simulated (${simulationResult.scenario})`} dataKey="simulatedHealth" stroke="#ef4444" strokeWidth={2.5} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
