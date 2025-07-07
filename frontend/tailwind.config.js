/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
        cinzel: ["Cinzel", "serif"],
        monsieur: ["Monsieur La Doulaise", "cursive"], // If you're using this elsewhere
        vibes: ["Great Vibes", "cursive"], // If you're using this elsewhere
      },
    },
  },
  plugins: [],
};
