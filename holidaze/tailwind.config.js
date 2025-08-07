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
    primary: "#1E3A8A",
    secondary: "#38BDF8",
    accent: "#F472B6",
    muted: "#94A3B8",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    border: "#E2E8F0",
    highlight: "#FEF9C3",
   },
   screens: {
    xs: "400px",
    sm: "616px",
    md: "725px",
   },
  },
 },
};
