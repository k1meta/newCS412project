/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CS2 Rarity Colors
        'rarity-consumer': '#b0c3d9',
        'rarity-industrial': '#5e98d9',
        'rarity-milspec': '#4b69ff',
        'rarity-restricted': '#8847ff',
        'rarity-classified': '#d32ce6',
        'rarity-covert': '#eb4b4b',
        'rarity-contraband': '#e4ae39',
        // App theme
        'cs-dark': '#1a1a2e',
        'cs-darker': '#0f0f1a',
        'cs-accent': '#f59e0b',
        'cs-blue': '#3b82f6',
      }
    },
  },
  plugins: [],
}
