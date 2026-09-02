/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: "#0A0E17",
        panel: "#10151F",
        line: "#1E2633",
        signal: "#2DD4BF",
        flag: "#F5A623",
        paper: "#EDF1F7",
        inkSoft: "#8D97AC",
      },
      boxShadow: {
        glass: "0 0 0 1px rgba(255,255,255,0.06) inset, 0 20px 80px rgba(45,212,191,0.15)",
      },
    },
  },
  plugins: [],
}
