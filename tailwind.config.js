/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        'gray-950': '#0d0d0d',
        'gray-900': '#121212',
        'gray-800': '#1E1E1E',
        'gray-700': '#2D2D2D',
        'gray-600': '#3C3C3C',
        'gray-400': '#A0A0A0',
        'gray-200': '#E0E0E0',
        'blue-500': '#3B82F6',
        'blue-400': '#60A5FA',
      }
    },
  },
  plugins: [],
}
