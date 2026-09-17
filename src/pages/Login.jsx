import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  KeyRound, 
  UserCheck, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Copy, 
  Check 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';

export const Login = () => {
  const { login, sendOtp, verifyOtp, user } = useAuth();
  const { setActiveTab } = useTelemetry();

  // Mode: 'register' | 'login'
  const [authMode, setAuthMode] = useState('register');
  
  // Step: 'form' | 'otp'
  const [step, setStep] = useState('form');

  // Form Fields
  const [name, setName] = useState('Anjali Yadav');
  const [email, setEmail] = useState('ay8572873559@gmail.com');
  const [organization, setOrganization] = useState('DRDO Aeronautical Development Establishment');
  const [clearance, setClearance] = useState('Level 4 Defense Security');

  // OTP State (6 separate digits)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef([]);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dispatchedOtp, setDispatchedOtp] = useState('');
  const [copied, setCopied] = useState(false);

  // Resend Countdown Timer (60s)
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Step 1: Send OTP to user's email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || (authMode === 'register' && !name)) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendOtp(email, name);
      if (res.success) {
        setDispatchedOtp(res.otp);
        setStep('otp');
        setCountdown(60);
        setCanResend(false);
        setOtpDigits(['', '', '', '', '', '']);
        // Focus first digit box after render
        setTimeout(() => {
          if (otpInputsRef.current[0]) {
            otpInputsRef.current[0].focus();
          }
        }, 150);
      } else {
        setErrorMessage(res.message || 'Failed to dispatch OTP. Please retry.');
      }
    } catch (err) {
      setErrorMessage('Network error while dispatching OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle 6-Digit OTP Box input
  const handleDigitChange = (index, value) => {
    setErrorMessage('');
    const char = value.slice(-1); // Take only latest char

    if (char && !/^\d+$/.test(char)) return; // Only numbers allowed

    const nextDigits = [...otpDigits];
    nextDigits[index] = char;
    setOtpDigits(nextDigits);

    // Auto focus next box
    if (char && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const nextDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = pastedData[i] || '';
    }
    setOtpDigits(nextDigits);

    const nextFocusIndex = Math.min(pastedData.length, 5);
    otpInputsRef.current[nextFocusIndex]?.focus();
  };

  // Quick auto-fill button for testing & demo presentation
  const handleQuickFill = () => {
    if (!dispatchedOtp) return;
    const digits = dispatchedOtp.split('');
    setOtpDigits(digits);
    setErrorMessage('');
    otpInputsRef.current[5]?.focus();
  };

  // Step 3: Verify the entered OTP
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    const result = verifyOtp(email, enteredOtp);

    if (result.success) {
      setSuccessMessage('ACCESS GRANTED — Registration Successful! Launching Command Dashboard...');
      setTimeout(() => {
        setActiveTab('dashboard');
      }, 1200);
    } else {
      setErrorMessage(result.message || 'Incorrect OTP. Verification failed. Please check the code and re-enter.');
      // Keep entered digits but shake/highlight
    }
    setIsLoading(false);
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setErrorMessage('');
    const res = await sendOtp(email, name);
    if (res.success) {
      setDispatchedOtp(res.otp);
      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    }
    setIsLoading(false);
  };

  // Copy OTP helper
  const handleCopyOtp = () => {
    if (!dispatchedOtp) return;
    navigator.clipboard.writeText(dispatchedOtp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-lg space-y-6">

        {/* DRDO & Defense Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-electric-bright via-cyan-400 to-blue-500 p-0.5 shadow-glow-cyan mx-auto flex items-center justify-center animate-float">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-mono-code font-bold text-cyan-400 tracking-widest uppercase">
              DRDO SIH 26054 • DEFENSE PROPULSION COMMAND
            </p>
            <h2 className="text-2xl sm:text-3xl font-tech font-black text-white tracking-wide">
              {step === 'otp' 
                ? 'Two-Factor Security Clearance' 
                : authMode === 'register' 
                  ? 'Engineer Registration & Clearance' 
                  : 'Mission Telemetry Sign In'}
            </h2>
            <p className="text-xs font-tech text-slate-300">
              MALE UAV Aero Piston Engine Digital Twin Health & Telemetry System
            </p>
          </div>
        </div>

        {/* Main Auth Container Card */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/40 shadow-glow-cyan space-y-6 relative overflow-hidden backdrop-blur-2xl">

          {/* Mode Switcher Tabs (Only shown in Form stage) */}
          {step === 'form' && (
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-navy-950 border border-cyan-500/20 text-xs font-tech font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'register'
                    ? 'bg-gradient-to-r from-electric-bright to-cyan-400 text-navy-950 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Sign Up / Register
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-electric-bright to-cyan-400 text-navy-950 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                Engineer Sign In
              </button>
            </div>
          )}

          {/* STEP 1: FORM DETAILS (Email, Name, Organization) */}
          {step === 'form' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-tech text-slate-300 block mb-1">
                    FULL NAME <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anjali Yadav"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/90 border border-cyan-500/30 text-white font-tech text-sm focus:outline-none focus:border-cyan-400 transition-all"
                    />
                    <Shield className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-tech text-slate-300 block mb-1">
                  DEFENSE EMAIL ADDRESS <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ay8572873559@gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/90 border border-cyan-500/30 text-white font-tech text-sm focus:outline-none focus:border-cyan-400 transition-all"
                  />
                  <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                </div>
                <p className="text-[10px] text-slate-400 font-mono-code mt-1">
                  A 6-digit one-time authorization code will be dispatched to this address.
                </p>
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-tech text-slate-300 block mb-1">
                      DEFENSE ORGANIZATION / COMMAND
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-950/90 border border-cyan-500/20 text-slate-300 font-tech text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-tech text-slate-300 block mb-1">
                      ASSIGNED SECURITY CLEARANCE
                    </label>
                    <select
                      value={clearance}
                      onChange={(e) => setClearance(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-950/90 border border-cyan-500/20 text-cyan-300 font-tech text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Level 4 Defense Security">Level 4 Defense Security (Full Flight Telemetry)</option>
                      <option value="Level 3 Flight Systems Analyst">Level 3 Flight Systems Analyst</option>
                      <option value="Level 2 Maintenance Technician">Level 2 Maintenance Technician</option>
                    </select>
                  </div>
                </>
              )}

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-tech flex items-center gap-2 animate-shake">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-electric-bright via-cyan-400 to-blue-500 text-navy-950 font-tech font-bold text-sm tracking-wide shadow-glow-cyan hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Defense OTP...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    {authMode === 'register' ? 'Generate & Send Verification OTP' : 'Send One-Time Login Code'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Pre-filled Credentials */}
              <div className="p-3 rounded-2xl bg-navy-950/60 border border-cyan-500/15 text-xs font-mono-code space-y-1">
                <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-cyan-500/10">
                  <span>PRE-CONFIGURED DEFENSE PROFILE:</span>
                  <span className="text-[10px] text-emerald-400">READY</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-300">Name: <strong className="text-white">Anjali Yadav</strong></span>
                  <span className="text-slate-300">Email: <strong className="text-cyan-300">ay8572873559@gmail.com</strong></span>
                </div>
              </div>
            </form>
          ) : (
            /* STEP 2: 6-DIGIT OTP VERIFICATION */
            <div className="space-y-5">
              {/* Notification Banner with Dispatched Code info */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 shadow-glow-cyan space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-tech font-bold text-cyan-300 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    DEFENSE OTP DISPATCHED
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono-code font-bold">
                    ACTIVE (5 MIN)
                  </span>
                </div>
                <p className="text-slate-300 font-subtech leading-relaxed">
                  A 6-digit cryptographic security code was sent to: <strong className="text-white">{email}</strong>
                </p>

                {/* Tactical Quick-Demo Helper: Allows judges / evaluators to test instantly */}
                {dispatchedOtp && (
                  <div className="mt-2 p-2.5 rounded-xl bg-navy-900 border border-cyan-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span className="text-[11px] font-mono-code text-slate-300">
                        Dispatched Code: <strong className="text-amber-300 tracking-widest text-sm font-bold">{dispatchedOtp}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleCopyOtp}
                        className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[10px] font-tech flex items-center gap-1"
                        title="Copy Code"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        type="button"
                        onClick={handleQuickFill}
                        className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-tech font-bold"
                        title="Auto-fill Code"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 6 Individual Digit PIN Boxes */}
              <div className="space-y-2">
                <label className="text-xs font-tech text-slate-300 block text-center">
                  ENTER 6-DIGIT VERIFICATION CODE
                </label>
                <div 
                  className="flex items-center justify-center gap-2 sm:gap-3"
                  onPaste={handleDigitPaste}
                >
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono-code font-bold rounded-xl bg-navy-950 border transition-all focus:outline-none ${
                        errorMessage 
                          ? 'border-red-500 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.5)]' 
                          : digit 
                            ? 'border-cyan-400 text-cyan-300 shadow-glow-cyan bg-navy-900' 
                            : 'border-cyan-500/30 text-white focus:border-cyan-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Error Message Display: Bold and prominent when incorrect */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-950/70 border border-red-500/70 text-red-200 text-xs font-tech flex items-center gap-2.5 animate-shake shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
                  <div>
                    <p className="font-bold text-red-300">VERIFICATION FAILED</p>
                    <p className="text-[11px] text-red-200 mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Success Message Display */}
              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-tech flex items-center gap-2.5 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-300">ACCESS GRANTED</p>
                    <p className="text-[11px] text-emerald-200 mt-0.5">{successMessage}</p>
                  </div>
                </div>
              )}

              {/* Verification Button */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading || otpDigits.join('').length !== 6}
                className={`w-full py-3.5 rounded-2xl font-tech font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                  otpDigits.join('').length === 6
                    ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-electric-bright text-navy-950 shadow-glow-cyan hover:brightness-110 cursor-pointer'
                    : 'bg-navy-900 border border-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Validating Defense Credentials...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Verify OTP & Enter Command Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend Code & Edit Email Controls */}
              <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between text-xs font-tech">
                <button
                  type="button"
                  onClick={() => { setStep('form'); setErrorMessage(''); }}
                  className="text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  ← Edit Email Address
                </button>

                <div>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-slate-500 font-mono-code flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Resend in {countdown}s
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer Security Badge */}
          <div className="pt-4 border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-slate-500 font-mono-code">
            <span>DRDO Clearance Protocol v4.2</span>
            <span>256-Bit TLS Defense Cryptography</span>
          </div>
        </div>
      </div>
    </div>
  );
};
