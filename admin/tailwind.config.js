/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F59E0B",
        "primary-dark": "#B45309",
        "dark-accent": "#422006",
        "light-background": "#FDFBF7",
        "text-primary": "#1C1917",
        "text-secondary": "#57534E",
        border: "#E7E5E4",
        success: "#16A34A",
        error: "#DC2626",
        warning: "#FBBF24",
      },
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
