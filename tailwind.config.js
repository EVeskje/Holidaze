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
  "dark-blue": "#243B53",  
  "soft-pink": "#F9A8C9",   
  "light-blue": "#F0F7FA",  
  "dark-gray": "#4B5563",   
  "sand": "#FAEBD7",       
  "teal": "#5CC8BA",        
},
      fontFamily: {
        sans: ["Inter", "sans-serif"],             // Default body font
        display: ["Playfair Display", "serif"],    // Elegant
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("flowbite/plugin")],
};