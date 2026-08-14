/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#0B0F17',
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          copper: '#F97316',
          amber: '#F59E0B',
          cyan: '#06B6D4',
          emerald: '#10B981',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
