/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0B0E11',
          950: '#07090B',
          900: '#0B0E11',
          850: '#0F1318',
          800: '#12171E',
          750: '#161C24',
          700: '#1B232D',
          600: '#242E3B',
        },
        valence: {
          green: '#16C784',
          'green-bright': '#1ED791',
          'green-dark': '#0FA36B',
          red: '#EA3943',
          'red-bright': '#F25059',
          'red-dark': '#C92A33',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 32px -6px rgba(22, 199, 132, 0.35)',
        'glow-sm': '0 0 18px -4px rgba(22, 199, 132, 0.28)',
        'glow-red': '0 0 24px -6px rgba(234, 57, 67, 0.32)',
        card: '0 10px 30px -10px rgba(0, 0, 0, 0.55)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in': 'slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
