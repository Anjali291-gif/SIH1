import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';

export const Login = () => {
  const { login } = useAuth();
  const { setActiveTab } = useTelemetry();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('Anjali');
  const [email, setEmail] = useState('ay8572873559@gmail.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-electric-bright to-cyan-400 p-0.5 shadow-glow-cyan mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
          </div>

          <h2 className="text-2xl font-tech font-bold text-white tracking-wide mt-3">
            {isSignUp ? 'Engineer Registration' : 'Mission Telemetry Portal'}
          </h2>
          <p className="text-sm font-tech text-cyan-400 tracking-wide neon-text-cyan">
            “Smarter Engines. Safer Missions.”
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 shadow-glow-cyan space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-xs font-tech text-slate-300 block mb-1">FULL NAME</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-cyan-500/30 text-white font-tech text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <Shield className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-tech text-slate-300 block mb-1">DEFENSE EMAIL ADDRESS</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-cyan-500/30 text-white font-tech text-sm focus:outline-none focus:border-cyan-400"
                />
                <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-tech text-slate-300 block mb-1">SECURITY PASSWORD</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-cyan-500/30 text-white font-tech text-sm focus:outline-none focus:border-cyan-400"
                />
                <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-electric-bright to-cyan-400 text-navy-950 font-tech font-bold text-sm tracking-wide shadow-glow-cyan hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isSignUp ? 'Create Engineer Account' : 'Authenticate & Launch Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Pre-fill Note */}
          <div className="p-3 rounded-2xl bg-navy-950/80 border border-cyan-500/10 text-xs font-mono-code space-y-1">
            <p className="text-slate-400">PRE-AUTHENTICATED PROFILE:</p>
            <p className="text-white font-bold">User: <span className="text-cyan-300">Anjali</span></p>
            <p className="text-slate-300">Email: <span className="text-cyan-300">ay8572873559@gmail.com</span></p>
          </div>

          <div className="pt-4 border-t border-cyan-500/15 flex items-center justify-between text-xs">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-cyan-400 hover:underline font-subtech font-bold"
            >
              {isSignUp ? 'Already registered? Sign In' : 'New Engineer? Create Account'}
            </button>

            <span className="text-[10px] text-slate-500 font-mono-code">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
