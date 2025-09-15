/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        night: "#0B0A1C",
      },
      colors: {
      night: '#0f0f2e',
    },
      boxShadow: {
        'glass': "0 0 0 1px rgba(255,255,255,0.06) inset, 0 20px 80px rgba(79,70,229,0.25)",
      }
    },
  },
  plugins: [],
}
