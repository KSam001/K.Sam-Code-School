/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: '#ffffff', dark: '#0a0a0a' },
        paper: { DEFAULT: '#f5f5f5', dark: '#171717' },
        ash: { DEFAULT: '#e5e5e5', dark: '#262626' },
        smoke: { DEFAULT: '#d4d4d4', dark: '#404040' },
        ink: { DEFAULT: '#0a0a0a', dark: '#ffffff' },
        charcoal: { DEFAULT: '#171717', dark: '#f5f5f5' },
        graphite: { DEFAULT: '#262626', dark: '#e5e5e5' },
        slate: { DEFAULT: '#404040', dark: '#d4d4d4' },
        steel: { DEFAULT: '#525252', dark: '#a3a3a3' },
        fog: { DEFAULT: '#737373', dark: '#737373' },
        accent: { DEFAULT: '#2563eb', dark: '#3b82f6' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};
