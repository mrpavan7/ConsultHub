/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        "clamp-sm": "clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem)",
        "clamp-base": "clamp(1rem, 0.34vw + 0.91rem, 1.19rem)",
        "clamp-lg": "clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem)",
        "clamp-xl": "clamp(1.56rem, 1vw + 1.31rem, 2.11rem)",
        "clamp-2xl": "clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem)",
      },
      extend: {
        utilities: {
          ".scrollbar-hide": {
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out",
        slideDown: "slideDown 0.5s ease-out",
        blob: "blob 7s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": {
            transform: "translateY(-20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};
