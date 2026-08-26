/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#fcd34d',
          500: '#f59e0b',
          600: '#d97706',
        },
        dark: {
          DEFAULT: '#0a0a0f',
          2: '#111118',
          3: '#1a1a2e',
          4: '#16213e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s infinite',
        'live-pulse': 'live-pulse 2s infinite',
      }
    },
  },
  plugins: [],
}