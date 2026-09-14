/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030611',
          900: '#060a17',
          850: '#0a1024',
          800: '#0f172a',
          750: '#15213b',
          700: '#1e293b',
        },
        cyan: {
          400: '#38bdf8',
          500: '#06b6d4',
          glow: '#00f0ff',
        },
        electric: {
          blue: '#1a75ff',
          bright: '#0066ff',
          neon: '#00e5ff',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.35), inset 0 0 15px rgba(0, 240, 255, 0.15)',
        'glow-blue': '0 0 20px rgba(26, 117, 255, 0.35), inset 0 0 15px rgba(26, 117, 255, 0.15)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.45), inset 0 0 15px rgba(239, 68, 68, 0.2)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.45), inset 0 0 15px rgba(245, 158, 11, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'radar-spin': 'radarSpin 10s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.02)' },
        },
        radarSpin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
