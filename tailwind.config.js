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
  "primary": "#1E293B",       // Soft navy (headings, main text)
  "secondary": "#64748B",     // Muted slate gray (body text)
  "accent": "#DF6951",        // Coral/red accent (buttons/highlights)
  "highlight": "#FCD34D",     // Soft golden yellow (small highlights)
  "background": "#F9FAFB",    // Very light gray (section backgrounds)
  "surface": "#FFFFFF",       // Pure white (cards, header, footer)
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
