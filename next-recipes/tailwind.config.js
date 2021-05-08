const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: colors.yellow,
      secondary: colors.purple,
    },
    fontFamily: {
      default: ["Raleway", "sans-serif"],
      display: ["Lekton"],
    },
    letterSpacing: {
      tightest: "-.05em",
      tight: "-.05px",
      comfy: ".15px",
      wide: ".25px",
      wider: "1.25px",
      widest: "1.5px",
    },
    extend: {
      fontSize: {
        "7xl": "5rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
