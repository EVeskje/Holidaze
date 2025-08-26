/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#2A3D56",
        "soft-pink": "#FFAAA8;",
        "light-blue": "#E9EFF4",
        "dark-gray": "#565656",
        "almost-white": "#fefefe",
      },
      screens: {
        xs: "400px",
        sm: "616px",
        md: "725px",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("flowbite/plugin")],
};
