/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'equel': '0 0 15px -4px rgba(0, 0, 0, 0.2)',
      },
      fontSize: {
        'placeholder': '14px',
      },
      colors: {
        'background': '#faf5ff',
        'admin-sideBar':'#0B304D'
      }
   } ,  
  plugins: [],
}
})
