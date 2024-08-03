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
        scroll: {
          "0%": { backgroundPosition: "center top" },
          "50%": { backgroundPosition: "center bottom" },
          "100%": { backgroundPosition: "center top" },
        },
        slideIn: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        fadeIn: "fadeIn 2s ease-out",
        scroll: "scroll 15s linear infinite",
        slideIn: 'slideIn 0.5s ease-in-out forwards',
      },
    },
    variants: {
      extend: {
        animation: ["hover"], // Enable hover variant for animation
      },
    },
  },
  plugins: [daisyui,require('@vidstack/react/tailwind.cjs')],
};
