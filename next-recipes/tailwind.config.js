const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      grey: {
        ...colors.coolGray,
        'DEFAULT': colors.coolGray[300],
      },
      primary: {
        ...colors.yellow,
        'DEFAULT': colors.yellow[400],
      },
      secondary: {
        '50': '#efe9ff',
        '100': '#d5c9fe',
        '200': '#b8a5fe',
        '300': '#987fff',
        'DEFAULT': '#5b44fd',
        '400': '#7B61FF',
        '500': '#5b44fd',
        '600': '#4c3ff6',
        '700': '#3237ed',
        '800': '#0031e7',
        '900': '#0026d8'
      },
    },
    borderWidth: {
      '2': '2px',
      '3': '3px'
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
      spacing: {
        '1.5': '0.375rem'
      },
      fontSize: {
        "7xl": "5rem",
      },
      boxShadow: {
        strong: '4px 4px 0 0 #000000',
        'strong-primary': '4px 4px 0 0 rgb(250, 204, 21)',
        'strong-primary-dark': '4px 4px 0 0 rgb(202, 138, 4)',
        'strong-secondary': '4px 4px 0 0 #987fff',
      },
      outline: {
        white: '2px solid #FFFFFF',
        primary: '2px solid rgb(250, 204, 21)',
        secondary: '2px solid #987fff',
        default: '2px solid #000000',
        'default-small': '1px solid #000000'
      },
      transitionProperty: {
        'box-shadow': 'transform, box-shadow'
      }
    },
  },
  plugins: [],
};
