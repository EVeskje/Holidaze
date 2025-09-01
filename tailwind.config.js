/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        logo: ["Playfair Display", "serif"],
      },
      colors: {
        primary: "#1E293B", // Soft navy
        secondary: "#64748B", // Muted slate gray
        accent: "#DF6951", // Coral/red accent
        highlight: "#F2994A", // Soft orange
        background: "#F9FAFB", // Very light gray
        surface: "#FFFFFF", // Pure white
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
