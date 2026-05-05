/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        asana: {
          dark: '#1E1E1E',
          sidebar: '#171717',
          coral: '#F06A6A',
          hover: '#2A2B2C',
          text: '#E5E5E5',
          muted: '#9CA3AF'
        }
      }
    },
  },
  plugins: [],
}
