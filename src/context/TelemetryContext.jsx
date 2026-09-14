import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DEFAULT_TELEMETRY, runEngineAIInference } from '../services/api';
import { audioService } from '../services/audioService';

const TelemetryContext = createContext();

export const TelemetryProvider = ({ children }) => {
  const [telemetry, setTelemetry] = useState(DEFAULT_TELEMETRY);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      timestamp: '12:44:10',
      title: 'Potential Engine Overheating Detected',
      description: 'Crankcase cylinder head temperature elevated (+14%). Probability: 87%.',
      severity: 'warning',
      parameter: 'Temperature',
      value: '82°C',
      acknowledged: false
    },
    {
      id: 2,
      timestamp: '11:20:05',
      title: 'Vibration Amplitude Elevated',
      description: 'Secondary piston harmonic vibration increased (+31%).',
      severity: 'warning',
      parameter: 'Vibration',
      value: '0.42g',
      acknowledged: true
    }
  ]);

  const [isSimulating, setIsSimulating] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [demoStage, setDemoStage] = useState(1); // 1: Healthy, 2: Warning, 3: Critical, 4: Emergency
  const [activeTab, setActiveTab] = useState('home');

  // Guided Tour State for Demo Mode
  const [tourStep, setTourStep] = useState(0);
  const [tourText, setTourText] = useState('');
  const [isTourPaused, setIsTourPaused] = useState(false);
  const [tourPace, setTourPace] = useState('slow'); // 'slow' | 'normal'

  const prevStatusRef = useRef('Healthy');
  const tourTimeoutRef = useRef(null);
  const isTourPausedRef = useRef(false);
  const currentTourIndexRef = useRef(0);

  useEffect(() => {
    audioService.setSoundEnabled(true);
    audioService.setVoiceEnabled(true);
  }, []);

  // Thorough, detailed, clear step-by-step technical explanations for judges
  const TOUR_STEPS = [
    {
      step: 1,
      tab: 'home',
      stage: 1,
      title: 'Platform Overview & Problem Statement 26054',
      text: 'Welcome to the Defense Digital Twin Platform for Problem Statement 26054. This system is engineered specifically for Medium-Altitude Long-Endurance Unmanned Aerial Vehicles. Our platform creates a real-time, physics-informed digital twin of aero piston engines, enabling continuous health monitoring, early fault prediction, and structural remaining useful life estimation to guarantee mission reliability.'
    },
    {
      step: 2,
      tab: 'dashboard',
      stage: 1,
      title: 'Operational Command Dashboard',
      text: 'We are now on the Main Operational Dashboard. Notice the composite Engine Health Score at 86 percent in healthy status. On the right, eight real-time telemetry parameters are monitored simultaneously: Engine Speed at 4520 RPM, Cylinder Temperature at 82 degrees Celsius, Lubrication Oil Pressure at 3.8 bar, and Vibration at 0.42g. Below, our predictive models detect an early overheating probability of 87 percent with an estimated Remaining Useful Life of 42 hours.'
    },
    {
      step: 3,
      tab: 'twin',
      stage: 1,
      title: 'Interactive 3D Digital Twin & 3 View Layers',
      text: 'Now examining the Interactive 3D Digital Twin of the aero propulsion engine. Notice the three distinct view layers in the upper right. Layer 1 provides a 360-degree interactive perspective with floating sensor callout pins and dynamic thermal glowing on the red combustion core. Layer 2 reveals an internal cutaway cross-section showing reciprocating piston motion and live fluid flow. Layer 3 delivers a tactical inspection mode for structural verification.'
    },
    {
      step: 4,
      tab: 'live',
      stage: 1,
      title: 'Real-Time Multi-Channel Live Sensor Telemetry',
      text: 'Switching to Live Sensor Monitoring. Telemetry streams arrive with sub-50 millisecond latency. Each sensor tile features real-time animated values and sparklines. You can filter data across 1 hour, 6 hours, or 24 hours, and click any sensor—such as temperature or vibration—to inspect its live high-frequency waveform graph.'
    },
    {
      step: 5,
      tab: 'ai',
      stage: 2,
      title: 'Predictive Diagnostics & Explainable Root Cause Analysis',
      text: 'Now entering Predictive Diagnostics. The critical question for defense engineers is: Why did the system make this prediction? Our explainable model breaks down the exact contributing factors: a 14 percent rise in temperature, a 31 percent increase in secondary harmonic vibration, and a 12 percent drop in oil pressure. Model confidence bars confirm high certainty across XGBoost fault classification and LSTM remaining useful life regression.'
    },
    {
      step: 6,
      tab: 'simulation',
      stage: 2,
      title: 'What-If Stress Simulation & Flight Envelope Testing',
      text: 'Here is the Simulation and What-If Stress Analysis suite. Defense operators can test extreme operational conditions before flight. Selecting presets such as High Temperature, High Load, or High Altitude allows real-time slider adjustments of temperature, load, and RPM. The engine calculates predicted health impact and plots a side-by-side comparative degradation curve against normal baseline operations.'
    },
    {
      step: 7,
      tab: 'twin',
      stage: 4,
      title: 'Real-Time Degradation Alert & Acoustic Emergency Siren',
      text: 'Simulating sudden thermal buildup. As temperature crosses critical thresholds, the platform instantly triggers acoustic siren alarms, flashes visual red strobes on the 3D engine, and generates prioritized emergency warning banners. Acoustic tones are synthesized through the Web Audio API to alert command center personnel immediately.'
    },
    {
      step: 8,
      tab: 'maintenance',
      stage: 3,
      title: 'Prescriptive Maintenance Action Protocols',
      text: 'Transitioning to Prescriptive Maintenance. Rather than generic schedules, the platform dynamically generates actionable maintenance checklists based on actual detected physical wear. High-priority directives instruct technicians to inspect cylinder cooling fins, verify oil filtration, and analyze vibration peaks before the 42-hour overhaul window expires.'
    },
    {
      step: 9,
      tab: 'reports',
      stage: 1,
      title: 'Defense Telemetry Audit Reports & PDF Export',
      text: 'Finally, reviewing the Defense Telemetry Audit Reports. Formatted specifically for aerospace engineer Anjali under Level 4 defense clearance, these comprehensive audit reports synthesize full telemetry histories, machine learning diagnostics, and flight log signatures ready for instant PDF export and mission debriefing. The automated demonstration is now complete.'
    }
  ];

  // Execute a specific tour step with deliberate pacing
  const executeTourStep = (index) => {
    if (index >= TOUR_STEPS.length) {
      setTourText('Automated demonstration completed successfully. All engine telemetry streams returned to nominal monitoring.');
      setTimeout(() => {
        stopDemoMode();
      }, 5000);
      return;
    }

    currentTourIndexRef.current = index;
    const currentStep = TOUR_STEPS[index];
    setTourStep(index + 1);
    setTourText(currentStep.text);
    setActiveTab(currentStep.tab);
    setDemoStage(currentStep.stage);

    // Audio effects per step
    if (currentStep.stage === 4) {
      audioService.startEmergencySiren();
    } else if (currentStep.stage === 2) {
      audioService.playWarningSound();
    }

    // Speech rate: slow (0.84) or normal (0.92)
    const speechRate = tourPace === 'slow' ? 0.84 : 0.92;
    const readingPauseMs = tourPace === 'slow' ? 4000 : 2500;

    audioService.speakTourNarration(currentStep.text, () => {
      if (isTourPausedRef.current) return;

      if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
      tourTimeoutRef.current = setTimeout(() => {
        if (isTourPausedRef.current) return;

        if (currentStep.stage === 4) {
          audioService.stopSiren();
        }
        executeTourStep(index + 1);
      }, readingPauseMs);
    }, speechRate);
  };

  const startDemoMode = () => {
    setDemoMode(true);
    setIsTourPaused(false);
    isTourPausedRef.current = false;
    audioService.stopSiren();
    executeTourStep(0);
  };

  const stopDemoMode = () => {
    setDemoMode(false);
    setTourStep(0);
    setTourText('');
    setDemoStage(1);
    setIsTourPaused(false);
    isTourPausedRef.current = false;
    audioService.stopSiren();
    audioService.stopVoice();
    if (tourTimeoutRef.current) {
      clearTimeout(tourTimeoutRef.current);
      tourTimeoutRef.current = null;
    }
  };

  const togglePauseTour = () => {
    if (isTourPaused) {
      // Resume
      setIsTourPaused(false);
      isTourPausedRef.current = false;
      audioService.resumeSpeech();
    } else {
      // Pause
      setIsTourPaused(true);
      isTourPausedRef.current = true;
      audioService.pauseSpeech();
      if (tourTimeoutRef.current) {
        clearTimeout(tourTimeoutRef.current);
        tourTimeoutRef.current = null;
      }
    }
  };

  const nextTourStep = () => {
    if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
    audioService.stopVoice();
    audioService.stopSiren();
    setIsTourPaused(false);
    isTourPausedRef.current = false;
    executeTourStep(tourStep);
  };

  const prevTourStep = () => {
    if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
    audioService.stopVoice();
    audioService.stopSiren();
    setIsTourPaused(false);
    isTourPausedRef.current = false;
    executeTourStep(Math.max(0, tourStep - 2));
  };

  // Main Telemetry stream tick (every 2s)
  useEffect(() => {
    if (!isSimulating && !demoMode) return;

    const interval = setInterval(() => {
      setTelemetry(prev => {
        let newTemp = prev.temperature;
        let newVib = prev.vibration;
        let newOil = prev.oilPressure;
        let newFuel = prev.fuelConsumption;
        let newRpm = prev.rpm;
        let newLoad = prev.engineLoad;
        let newExhaust = prev.exhaustTemp;

        if (demoMode) {
          if (demoStage === 1) {
            newTemp = 74 + Number((Math.random() * 2 - 1).toFixed(1));
            newVib = 0.22 + Number((Math.random() * 0.04 - 0.02).toFixed(2));
            newOil = 4.1 + Number((Math.random() * 0.1 - 0.05).toFixed(1));
            newFuel = 9.2 + Number((Math.random() * 0.2 - 0.1).toFixed(1));
            newRpm = 4440 + Math.round(Math.random() * 40 - 20);
            newLoad = 60 + Math.round(Math.random() * 4 - 2);
            newExhaust = 572 + Math.round(Math.random() * 10 - 5);
          } else if (demoStage === 2) {
            newTemp = 87 + Number((Math.random() * 2 - 1).toFixed(1));
            newVib = 0.52 + Number((Math.random() * 0.06 - 0.03).toFixed(2));
            newOil = 3.4 + Number((Math.random() * 0.1 - 0.05).toFixed(1));
            newFuel = 10.6 + Number((Math.random() * 0.3 - 0.15).toFixed(1));
            newRpm = 4650 + Math.round(Math.random() * 60 - 30);
            newLoad = 76 + Math.round(Math.random() * 6 - 3);
            newExhaust = 652 + Math.round(Math.random() * 14 - 7);
          } else if (demoStage === 3) {
            newTemp = 97 + Number((Math.random() * 3 - 1.5).toFixed(1));
            newVib = 0.82 + Number((Math.random() * 0.08 - 0.04).toFixed(2));
            newOil = 2.7 + Number((Math.random() * 0.1 - 0.05).toFixed(1));
            newFuel = 12.1 + Number((Math.random() * 0.4 - 0.2).toFixed(1));
            newRpm = 4920 + Math.round(Math.random() * 80 - 40);
            newLoad = 90 + Math.round(Math.random() * 6 - 3);
            newExhaust = 728 + Math.round(Math.random() * 20 - 10);
          } else if (demoStage === 4) {
            newTemp = 118 + Number((Math.random() * 5 - 2.5).toFixed(1));
            newVib = 1.45 + Number((Math.random() * 0.15 - 0.07).toFixed(2));
            newOil = 1.2 + Number((Math.random() * 0.2 - 0.1).toFixed(1));
            newFuel = 14.8 + Number((Math.random() * 0.5 - 0.25).toFixed(1));
            newRpm = 5340 + Math.round(Math.random() * 120 - 60);
            newLoad = 98 + Math.round(Math.random() * 2 - 1);
            newExhaust = 860 + Math.round(Math.random() * 30 - 15);
          }
        } else {
          newTemp = Math.max(68, Math.min(105, Number((prev.temperature + (Math.random() * 0.8 - 0.4)).toFixed(1))));
          newVib = Math.max(0.15, Math.min(1.2, Number((prev.vibration + (Math.random() * 0.04 - 0.02)).toFixed(2))));
          newOil = Math.max(2.0, Math.min(5.0, Number((prev.oilPressure + (Math.random() * 0.04 - 0.02)).toFixed(1))));
          newFuel = Math.max(8.0, Math.min(15.0, Number((prev.fuelConsumption + (Math.random() * 0.1 - 0.05)).toFixed(1))));
          newRpm = Math.max(3800, Math.min(5400, Math.round(prev.rpm + (Math.random() * 20 - 10))));
          newLoad = Math.max(40, Math.min(98, Math.round(prev.engineLoad + (Math.random() * 2 - 1))));
          newExhaust = Math.round(newTemp * 7.5);
        }

        const aiInference = runEngineAIInference({
          temperature: newTemp,
          vibration: newVib,
          oilPressure: newOil,
          fuelConsumption: newFuel,
          rpm: newRpm,
          engineLoad: newLoad
        });

        let overrideHealth = aiInference.healthScore;
        let overrideStatus = aiInference.status;
        if (demoMode && demoStage === 1) { overrideHealth = Math.max(93, overrideHealth); overrideStatus = 'Healthy'; }
        if (demoMode && demoStage === 4) { overrideHealth = Math.min(18, Math.max(8, overrideHealth)); overrideStatus = 'Emergency'; }

        const updated = {
          ...prev,
          temperature: newTemp,
          vibration: newVib,
          oilPressure: newOil,
          fuelConsumption: newFuel,
          rpm: newRpm,
          engineLoad: newLoad,
          exhaustTemp: newExhaust,
          healthScore: overrideHealth,
          status: overrideStatus,
          predictedFault: aiInference.predictedFault,
          faultProbability: aiInference.faultProbability,
          rulHours: demoStage === 4 ? Math.max(1, Math.round(overrideHealth / 10)) : aiInference.rulHours,
          contributingFactors: aiInference.contributingFactors,
          confidenceScores: aiInference.confidenceScores
        };

        setHistory(h => {
          const timestamp = new Date().toLocaleTimeString();
          return [...h, { time: timestamp, ...updated }].slice(-30);
        });

        const prevStatus = prevStatusRef.current;
        if (updated.status === 'Emergency' && prevStatus !== 'Emergency') {
          triggerNewAlert({
            title: '🔴 EMERGENCY: CATASTROPHIC ENGINE FAILURE IMMINENT',
            description: `Engine temperature CRITICAL at ${updated.temperature}°C! Vibration ${updated.vibration}g! Oil pressure collapsed to ${updated.oilPressure} bar! IMMEDIATE ABORT REQUIRED!`,
            severity: 'emergency',
            parameter: 'ALL SYSTEMS',
            value: `Health: ${updated.healthScore}%`
          });
        } else if (updated.status === 'Critical' && prevStatus !== 'Critical' && prevStatus !== 'Emergency') {
          triggerNewAlert({
            title: '🚨 CRITICAL: Engine Structural Failure Risk',
            description: `Engine health at ${updated.healthScore}%. ${updated.predictedFault} probability ${updated.faultProbability}%. Inspect immediately!`,
            severity: 'critical',
            parameter: 'Temperature / Vibration',
            value: `${updated.temperature}°C`
          });
        } else if (updated.status === 'Warning' && prevStatus === 'Healthy') {
          triggerNewAlert({
            title: '⚠️ WARNING: Engine Thermal Anomaly Detected',
            description: `Engine health degraded to ${updated.healthScore}%. ${updated.predictedFault} probability ${updated.faultProbability}%.`,
            severity: 'warning',
            parameter: 'Health Score',
            value: `${updated.healthScore}%`
          });
        }

        prevStatusRef.current = updated.status;
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, demoMode, demoStage]);

  const triggerNewAlert = (alertObj) => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      acknowledged: false,
      ...alertObj
    };
    setAlerts(prev => [newAlert, ...prev]);

    if (alertObj.severity === 'emergency') {
      audioService.startEmergencySiren();
      setTimeout(() => {
        audioService.speakVoiceAlert(
          'EMERGENCY ALERT! Catastrophic engine failure imminent! Immediate mission abort required!',
          'emergency'
        );
      }, 1000);
    } else if (alertObj.severity === 'critical') {
      audioService.playCriticalSound();
      setTimeout(() => {
        audioService.speakVoiceAlert(
          `CRITICAL ALERT! ${alertObj.title}. Immediate engine inspection required!`,
          'critical'
        );
      }, 800);
    } else {
      audioService.playWarningSound();
      audioService.speakVoiceAlert(`WARNING ALERT: ${alertObj.title}`, 'normal');
    }
  };

  const acknowledgeAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    audioService.stopSiren();
  };

  return (
    <TelemetryContext.Provider value={{
      telemetry,
      setTelemetry,
      history,
      alerts,
      activeTab,
      setActiveTab,
      isSimulating,
      setIsSimulating,
      demoMode,
      demoStage,
      startDemoMode,
      stopDemoMode,
      acknowledgeAlert,
      triggerNewAlert,
      tourStep,
      totalTourSteps: TOUR_STEPS.length,
      tourText,
      nextTourStep,
      prevTourStep,
      isTourPaused,
      togglePauseTour,
      tourPace,
      setTourPace
    }}>
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) throw new Error('useTelemetry must be used within a TelemetryProvider');
  return context;
};
