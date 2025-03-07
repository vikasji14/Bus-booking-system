/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        rightMove: {
          '0%': { left: '0' },
          '100%': { left: 'calc(100% - 2rem)' }
        }
      },
      animation: {
        'rightMove': 'rightMove 4s linear infinite'
      }
    },
  },
  plugins: [require("daisyui")],
};
