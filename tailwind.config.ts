import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slide: {
          "0%": {
            transform: "translateX(0px)",
          },

          "50%": {
            transform: "translateX(calc(600px - 100%))",
          },

          "100%": {
            transform: "translateX(0px)",
          },
        },
        scrollToLeft: {
          "0%": {
            transform: "translateX(0%)" /* Start position */,
          },
          "100%": {
            transform: "translateX(-100%)" /* End position */,
          },
        },
      },
      animation: {
        slide: "slide 50s ease infinite",
        scrollToLeft: "scrollToLeft 20s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
