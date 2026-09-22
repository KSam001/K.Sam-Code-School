/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f7f5ef',
        white: '#ffffff',
        ashmist: '#f5f5f5',
        softfog: '#f0f0f0',
        ink: '#171717',
        graphite: '#525252',
        steel: '#737373',
        silver: '#a3a3a3',
        resolve: '#22c55e',
        resolvebg: '#f0fdf4',
        resolvetext: '#15803d',
        warnbg: '#fffbeb',
        warntext: '#b45309',
        alert: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        pill: '9999px',
      },
      boxShadow: {
        card: 'rgba(0,0,0,0.05) 0px 3px 6px -3px, rgba(0,0,0,0.05) 0px 1px 2px -1px',
        soft: 'rgba(0,0,0,0.05) 0px 1px 2px 0px',
      },
    },
  },
  plugins: [],
};
