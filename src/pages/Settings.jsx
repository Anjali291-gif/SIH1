import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Volume2, VolumeX, Mic, MicOff, Moon, Cpu, Save, ShieldCheck, Play, StopCircle, Radio, Siren } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { audioService } from '../services/audioService';

export const Settings = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [alertSound, setAlertSound] = useState(user.preferences.alertSound);
  const [voiceAlert, setVoiceAlert] = useState(user.preferences.voiceAlert);
  const [emailNotifs, setEmailNotifs] = useState(user.preferences.emailNotifications);
  const [refreshRate, setRefreshRate] = useState(user.preferences.telemetryRefreshRate);
  const [emergencySoundType, setEmergencySoundType] = useState('combined');
  const [isTestingEmergency, setIsTestingEmergency] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      preferences: {
        alertSound,
        voiceAlert,
        emailNotifications: emailNotifs,
        telemetryRefreshRate: refreshRate
      }
    });

    audioService.setSoundEnabled(alertSound);
    audioService.setVoiceEnabled(voiceAlert);
    audioService.setEmergencySoundType(emergencySoundType);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleTestEmergencySound = () => {
    if (isTestingEmergency) {
      audioService.stopEmergencySounds();
      setIsTestingEmergency(false);
    } else {
      audioService.setEmergencySoundType(emergencySoundType);
      audioService.startFullEmergencyAlarm();
      setIsTestingEmergency(true);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-cyan-500/20">
        <h2 className="text-2xl font-tech font-bold text-white tracking-wide flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-cyan-400" />
          System Settings & Engineer Profile
        </h2>
        <p className="text-xs text-slate-400 font-subtech mt-0.5">
          Configure telemetry refresh rate, audio synthesize alerts, and user account credentials
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile Credentials Card */}
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-4">
          <h3 className="font-tech text-base font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            ENGINEER PROFILE CREDENTIALS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-tech text-slate-300 block mb-1">ENGINEER NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-cyan-500/30 text-white font-tech text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-tech text-slate-300 block mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-cyan-500/30 text-white font-tech text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-tech text-slate-300 block mb-1">CLEARANCE LEVEL</label>
              <input
                type="text"
                value={user.clearanceLevel}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-cyan-500/10 text-slate-400 font-tech text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-tech text-slate-300 block mb-1">DEFENSE ORGANIZATION</label>
              <input
                type="text"
                value={user.organization}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-cyan-500/10 text-slate-400 font-tech text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Audio & Alert Preferences Card */}
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-4">
          <h3 className="font-tech text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            ALERT SOUND & SPEECH SYNTHESIS PREFERENCES
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-navy-950/70 border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-tech text-sm font-bold text-white">Audio Alert Tones (100% Volume Boost)</p>
                  <p className="text-xs text-slate-400">Play high-gain Web Audio API dual-pitch beeps on Warning or Critical alerts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAlertSound(!alertSound)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${alertSound ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-navy-950 transition-transform ${alertSound ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-navy-950/70 border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-tech text-sm font-bold text-white">Voice Speech Alerts & Tour Narration</p>
                  <p className="text-xs text-slate-400">Crisp, deliberate spoken announcements via Web Speech API at 100% Volume</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVoiceAlert(!voiceAlert)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${voiceAlert ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-navy-950 transition-transform ${voiceAlert ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Emergency Stage Sound Engine Selector */}
            <div className="p-4 rounded-2xl bg-navy-950/90 border border-red-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Siren className="w-5 h-5 text-red-400 animate-pulse" />
                  <div>
                    <h4 className="font-tech text-sm font-bold text-red-300">EMERGENCY STAGE ACOUSTIC ENGINE</h4>
                    <p className="text-xs text-slate-400">Select the sound pattern generated during Stage 4 Emergency conditions</p>
                  </div>
                </div>

                {/* Test Emergency Sound Button */}
                <button
                  type="button"
                  onClick={toggleTestEmergencySound}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-tech font-bold flex items-center gap-1.5 transition-all ${
                    isTestingEmergency 
                      ? 'bg-red-500 text-white animate-ping shadow-[0_0_15px_rgba(239,68,68,0.8)]' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                  }`}
                >
                  {isTestingEmergency ? (
                    <>
                      <StopCircle className="w-3.5 h-3.5" />
                      Stop Test
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-red-300" />
                      Test Emergency Sound
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => { setEmergencySoundType('siren'); audioService.setEmergencySoundType('siren'); }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    emergencySoundType === 'siren'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'bg-navy-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-tech font-bold text-cyan-300">Avionics Cockpit Chime</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Sleek, melodic dual-tone flight deck caution chime (attractive & clean)</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setEmergencySoundType('klaxon'); audioService.setEmergencySoundType('klaxon'); }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    emergencySoundType === 'klaxon'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-navy-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-tech font-bold text-amber-300">Tactical Radar Pulsar</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">High-tech defense sonar ping with warm tactile decay</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setEmergencySoundType('combined'); audioService.setEmergencySoundType('combined'); }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    emergencySoundType === 'combined'
                      ? 'bg-red-500/20 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'bg-navy-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-tech font-bold text-red-300">Combined Defense Alert</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Dual avionics chime and tactical radar pulse together</p>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-navy-950/70 border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-tech text-sm font-bold text-white">Email & SMS Telemetry Digests</p>
                  <p className="text-xs text-slate-400">Send critical alerts to ay8572873559@gmail.com</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${emailNotifs ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-navy-950 transition-transform ${emailNotifs ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* AI & Telemetry Engine Settings */}
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-4">
          <h3 className="font-tech text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            TELEMETRY STREAM & MODEL HYPERPARAMETERS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-tech text-slate-300 block mb-1">STREAM REFRESH INTERVAL (SECONDS)</label>
              <select
                value={refreshRate}
                onChange={(e) => setRefreshRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-cyan-500/30 text-white font-tech text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value={1}>1 Second (Ultra High Frequency)</option>
                <option value={2}>2 Seconds (Standard Telemetry)</option>
                <option value={5}>5 Seconds (Low Bandwidth)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-tech text-slate-300 block mb-1">PREDICTIVE CLASSIFIER BACKEND</label>
              <input
                type="text"
                value="XGBoost v1.7 + PyTorch LSTM RUL Regressor"
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-cyan-500/10 text-slate-400 font-tech text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-electric-bright to-cyan-400 text-navy-950 font-tech font-bold text-sm tracking-wide shadow-glow-cyan hover:brightness-110 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            SAVE PREFERENCES
          </button>

          {savedSuccess && (
            <span className="text-xs font-tech text-emerald-400 flex items-center gap-1.5 animate-pulse">
              <ShieldCheck className="w-4 h-4" />
              Settings updated successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
