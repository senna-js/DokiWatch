import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "anime-red": "#FF0000", // Example color, replace with your choice
        "anime-blue": "#0000FF", // Example color, replace with your choice
        // Add more colors as needed
      },
      fontFamily: {
        anime: ['"Roboto Condensed"', "sans-serif"],
        comicSans: ['"Comic Sans MS"', "cursive", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        fadeIn: "fadeIn 2s ease-out",
      },
    },
  },
  plugins: [daisyui],
};
