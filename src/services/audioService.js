// Web Audio API Sound Synthesizer & Speech Alert Service — Multi-Sound Emergency System

class AudioAlertService {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.voiceEnabled = true;
    this.lastSpokenText = '';
    this.lastSpokenTime = 0;
    this.sirenIntervalId = null;
    this.klaxonIntervalId = null;
    this.currentUtterance = null;
    this.fallbackTimer = null;
    this.emergencySoundType = 'combined'; // 'combined' | 'siren' | 'klaxon' | 'cockpit'
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    if (!enabled) this.stopEmergencySounds();
  }

  setVoiceEnabled(enabled) {
    this.voiceEnabled = enabled;
    if (!enabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  setEmergencySoundType(type) {
    this.emergencySoundType = type;
  }

  // ============================================================
  // SUCCESS CHIME — Uplifting 3-Tone Authorization Melody
  // ============================================================
  playSuccessSound() {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

      notes.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        const t = now + i * 0.09;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.45, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch (err) {
      console.warn('Success sound failed:', err);
    }
  }

  // ============================================================
  // ERROR BUZZER — Low Reject Tone for Incorrect OTP
  // ============================================================
  playErrorBuzzer() {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      for (let i = 0; i < 2; i++) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        const t = now + i * 0.14;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

        osc.start(t);
        osc.stop(t + 0.12);
      }
    } catch (err) {
      console.warn('Error buzzer failed:', err);
    }
  }

  // ============================================================
  // WARNING ALERT — High Gain Rising Double-Beep Chime
  // ============================================================
  playWarningSound() {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(480, now);
      osc1.frequency.linearRampToValueAtTime(720, now + 0.22);
      gain1.gain.setValueAtTime(0.85, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc1.start(now);
      osc1.stop(now + 0.39);

      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(960, now + 0.38);
      osc2.frequency.linearRampToValueAtTime(1280, now + 0.62);
      gain2.gain.setValueAtTime(0.85, now + 0.38);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc2.start(now + 0.38);
      osc2.stop(now + 0.81);

      const bass = this.audioCtx.createOscillator();
      const bassGain = this.audioCtx.createGain();
      bass.connect(bassGain);
      bassGain.connect(this.audioCtx.destination);
      bass.type = 'sawtooth';
      bass.frequency.setValueAtTime(100, now);
      bassGain.gain.setValueAtTime(0.4, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      bass.start(now);
      bass.stop(now + 0.86);
    } catch (err) {
      console.warn('Warning sound failed:', err);
    }
  }

  // ============================================================
  // CRITICAL ALERT — Rapid Pulse Alarm Siren Burst
  // ============================================================
  playCriticalSound() {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      for (let i = 0; i < 5; i++) {
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        const lfo = this.audioCtx.createOscillator();
        const lfoGain = this.audioCtx.createGain();

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        const t = now + i * 0.18;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, t);
        osc.frequency.linearRampToValueAtTime(1300, t + 0.13);

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(22, t);
        lfoGain.gain.setValueAtTime(80, t);

        gainNode.gain.setValueAtTime(0.95, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

        osc.start(t);
        osc.stop(t + 0.17);
        lfo.start(t);
        lfo.stop(t + 0.17);
      }
    } catch (err) {
      console.warn('Critical sound failed:', err);
    }
  }

  // ============================================================
  // EMERGENCY SOUND 1: Modern Avionics Cockpit Dual Chime
  // Crisp, melodic, high-tech dual-pulse chime (attractive & urgent)
  // ============================================================
  startEmergencySiren() {
    if (!this.soundEnabled) return;
    if (this.sirenIntervalId) clearInterval(this.sirenIntervalId);

    const playAvionicsChime = () => {
      if (!this.soundEnabled) return;
      try {
        this.initAudio();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;

        // Two-tone chime: Note 1 (880 Hz) -> Note 2 (1175 Hz)
        const notes = [
          { freq: 880, start: 0, dur: 0.22 },
          { freq: 1175, start: 0.12, dur: 0.32 }
        ];

        notes.forEach(note => {
          const t = now + note.start;
          
          // Main resonant chime tone (sine)
          const osc = this.audioCtx.createOscillator();
          const gainNode = this.audioCtx.createGain();
          osc.connect(gainNode);
          gainNode.connect(this.audioCtx.destination);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.freq, t);

          // Smooth attack & musical bell decay
          gainNode.gain.setValueAtTime(0.001, t);
          gainNode.gain.linearRampToValueAtTime(0.55, t + 0.015);
          gainNode.gain.exponentialRampToValueAtTime(0.001, t + note.dur);

          osc.start(t);
          osc.stop(t + note.dur + 0.02);

          // Subtle harmonic brilliance overtone (triangle)
          const harm = this.audioCtx.createOscillator();
          const harmGain = this.audioCtx.createGain();
          harm.connect(harmGain);
          harmGain.connect(this.audioCtx.destination);

          harm.type = 'triangle';
          harm.frequency.setValueAtTime(note.freq * 2, t);
          harmGain.gain.setValueAtTime(0.001, t);
          harmGain.gain.linearRampToValueAtTime(0.18, t + 0.015);
          harmGain.gain.exponentialRampToValueAtTime(0.001, t + note.dur * 0.7);

          harm.start(t);
          harm.stop(t + note.dur);
        });

      } catch (err) {
        console.warn('Avionics chime failed:', err);
      }
    };

    playAvionicsChime();
    this.sirenIntervalId = setInterval(playAvionicsChime, 620); // Musical rhythmic interval
  }

  // ============================================================
  // EMERGENCY SOUND 2: Sleek Tactical Radar Pulsar
  // Crisp sonar/radar alert ping with smooth resonant tail
  // ============================================================
  startEmergencyKlaxon() {
    if (!this.soundEnabled) return;
    if (this.klaxonIntervalId) clearInterval(this.klaxonIntervalId);

    const playTacticalPulse = () => {
      if (!this.soundEnabled) return;
      try {
        this.initAudio();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;

        // Crisp high-tech radar ping
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046, now); // High C6
        osc.frequency.exponentialRampToValueAtTime(784, now + 0.16);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.6, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.start(now);
        osc.stop(now + 0.3);

        // Soft tactile sub-bass warm hum (satisfying low-end presence)
        const sub = this.audioCtx.createOscillator();
        const subGain = this.audioCtx.createGain();
        sub.connect(subGain);
        subGain.connect(this.audioCtx.destination);
        sub.type = 'triangle';
        sub.frequency.setValueAtTime(95, now);
        sub.frequency.exponentialRampToValueAtTime(50, now + 0.18);
        subGain.gain.setValueAtTime(0.35, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        sub.start(now);
        sub.stop(now + 0.22);

      } catch (err) {
        console.warn('Tactical pulse failed:', err);
      }
    };

    playTacticalPulse();
    this.klaxonIntervalId = setInterval(playTacticalPulse, 480);
  }

  // ============================================================
  // UNIFIED EMERGENCY AUDIO DISPATCHER: Combines both sounds!
  // ============================================================
  startFullEmergencyAlarm() {
    this.stopEmergencySounds();
    if (!this.soundEnabled) return;

    if (this.emergencySoundType === 'siren') {
      this.startEmergencySiren();
    } else if (this.emergencySoundType === 'klaxon') {
      this.startEmergencyKlaxon();
    } else {
      // 'combined' default: Plays BOTH the Scramble Siren AND the Master Caution Klaxon!
      this.startEmergencySiren();
      this.startEmergencyKlaxon();
    }
  }

  stopEmergencySounds() {
    if (this.sirenIntervalId) {
      clearInterval(this.sirenIntervalId);
      this.sirenIntervalId = null;
    }
    if (this.klaxonIntervalId) {
      clearInterval(this.klaxonIntervalId);
      this.klaxonIntervalId = null;
    }
  }

  stopSiren() {
    this.stopEmergencySounds();
  }

  playAlertSound(severity = 'warning') {
    if (!this.soundEnabled) return;
    if (severity === 'emergency') {
      this.startFullEmergencyAlarm();
    } else if (severity === 'critical') {
      this.stopEmergencySounds();
      this.playCriticalSound();
    } else {
      this.stopEmergencySounds();
      this.playWarningSound();
    }
  }

  // ============================================================
  // CLEAR, LOUD, DELIBERATE VOICE NARRATION (MAXIMUM VOLUME 1.0)
  // ============================================================
  speakTourNarration(text, onEnd, customRate = 0.84) {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }

    if (!this.voiceEnabled || !('speechSynthesis' in window)) {
      if (onEnd) setTimeout(onEnd, 7000);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      let currentIndex = 0;

      const speakNextSentence = () => {
        if (currentIndex >= sentences.length) {
          if (onEnd) onEnd();
          return;
        }

        const sentenceText = sentences[currentIndex].trim();
        if (!sentenceText) {
          currentIndex++;
          speakNextSentence();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(sentenceText);
        utterance.rate = customRate;
        utterance.pitch = 1.04;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
          (v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Google US English') || v.name.includes('Zira') || v.name.includes('George')) && v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en'));

        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
          currentIndex++;
          setTimeout(speakNextSentence, 300);
        };

        utterance.onerror = (err) => {
          console.warn('Speech error on sentence:', err);
          currentIndex++;
          setTimeout(speakNextSentence, 300);
        };

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      };

      const wordCount = text.split(' ').length;
      const totalEstimatedMs = (wordCount / 1.5) * 1000 + (sentences.length * 500) + 5000;
      this.fallbackTimer = setTimeout(() => {
        if (onEnd) onEnd();
      }, totalEstimatedMs);

      speakNextSentence();
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      if (onEnd) setTimeout(onEnd, 6000);
    }
  }

  speakVoiceAlert(message, priority = 'normal') {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;

    const now = Date.now();
    if (this.lastSpokenText === message && now - this.lastSpokenTime < 5000 && priority !== 'emergency') {
      return;
    }

    this.lastSpokenText = message;
    this.lastSpokenTime = now;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);

    if (priority === 'emergency') {
      utterance.rate = 0.82;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;
    } else if (priority === 'critical') {
      utterance.rate = 0.88;
      utterance.pitch = 1.04;
      utterance.volume = 1.0;
    } else {
      utterance.rate = 0.90;
      utterance.pitch = 1.02;
      utterance.volume = 1.0;
    }

    const voices = window.speechSynthesis.getVoices();
    const engVoice = voices.find(v => 
      (v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Google US English') || v.name.includes('Zira')) && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (engVoice) utterance.voice = engVoice;

    window.speechSynthesis.speak(utterance);
  }

  pauseSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  resumeSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  stopVoice() {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioService = new AudioAlertService();
