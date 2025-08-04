/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      screens: {
        'mobile': {'max': '499px'},
        'tablet': {'min': '500px', 'max': '768px'},
        'desktop': {'min': '769px'}
      }
    },
  },
  plugins: [],
}