/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'equel': '0 0 15px -4px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}

