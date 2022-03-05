const colors = require('tailwindcss/colors');

const screenREM = {
  sm: 37.5,
  md: 56.5,
  lg: 77.5,
  xl: 90
};

const REM = 16;

const screens = Object.entries(screenREM).reduce(
  (screens, [
    name,
    value
  ]) => ({
    ...screens,
    [name]: `${value * REM}px`
  }),
  {}
);

const headers = {
  'h1': {
    min: 2.5,
    max: 4,
    letterSpacing: '-1.5px'
  },
  'h2': {
    min: 2,
    max: 3.375,
    letterSpacing: '-0.5px'
  },
  'h3': {
    min: 1.75,
    max: 3,
    letterSpacing: '0px'
  },
  'h4': {
    min: 1.5,
    max: 2.375,
    letterSpacing: '0.25px'
  },
  'h5': {
    min: 1.25,
    max: 1.75,
    letterSpacing: '0px'
  },
  'h6': {
    min: 1.125,
    max: 1.375,
    letterSpacing: '0.15px'
  }
};

const SCREEN_DIFF = screenREM.lg - screenREM.sm;

const clamp = ({ min, max }) => {
  const sizeDiff = max - min;
  return `clamp(${min}rem, calc(${min}rem + ${sizeDiff} * ((100vw - ${screenREM.sm}rem) / ${SCREEN_DIFF})), ${max}rem)`;
};

const headersFontSizes = Object.entries(headers).reduce(
  (fontSizes, [
    key,
    { letterSpacing, ...values }
  ]) => ({
    ...fontSizes,
    [key]: [
      clamp(values),
      { letterSpacing }
    ]
  }),
  {}
);

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      grey: {
        50: '#F5F5F5',
        100: '#E9E9E9',
        200: '#D9D9D9',
        300: '#C4C4C4',
        400: '#9D9D9D',
        'DEFAULT': '#9D9D9D',
        500: '#7B7B7B',
        600: '#555555',
        700: '#434343',
        800: '#262626',
        900: '#000000'
      },
      primary: {
        50: '#FFF7DD',
        100: '#FFEBAD',
        200: '#FFDD7C',
        300: '#FED250',
        400: '#FFC636',
        'DEFAULT': '#FFC636',
        500: '#FFBC30',
        600: '#FFAD2D',
        700: '#FF992A',
        800: '#FF8728',
        900: '#FF6623'
      },
      secondary: {
        50: '#EEE9FD',
        100: '#D3CAFA',
        200: '#B5A8F8',
        300: '#9483F7',
        DEFAULT: '#9483F7',
        400: '#7667F6',
        500: '#554DF3',
        600: '#4847ED',
        700: '#3040E4',
        800: '#063ADE',
        900: '#0030CF'
      },
      terciary: {
        50: '#DCFAF3',
        100: '#ABF3DF',
        200: '#1AEEC7',
        DEFAULT: '#1AEEC7',
        300: '#63DEB3',
        400: '#5CD1A2',
        500: '#58C592',
        600: '#50B683',
        700: '#48A473',
        800: '#409464',
        900: '#317545'
      }
    },
    borderWidth: {
      '2': '2px',
      '3': '3px'
    },
    fontFamily: {
      default: [
        'NotoSans',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'sans-serif'
      ],
      display: [
        'Lekton',
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace'
      ]
    },
    letterSpacing: {
      tightest: '-.05em',
      tight: '-.05px',
      comfy: '.15px',
      wide: '.25px',
      wider: '1.25px',
      widest: '1.5px'
    },
    extend: {
      spacing: {
        '1.5': '0.375rem'
      },
      screens,
      maxWidth: {
        'container': '67rem'
      },
      fontSize: {
        ...headersFontSizes,
        '7xl': '5rem'
      },
      boxShadow: {
        strong: '4px 4px 0 0 #000000',
        'strong-small': '2px 2px 0 0 #000000',
        'strong-primary': '4px 4px 0 0 rgb(250, 204, 21)',
        'strong-primary-dark': '4px 4px 0 0 rgb(202, 138, 4)',
        'strong-secondary': '4px 4px 0 0 #987fff'
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
    }
  },
  plugins: []
};
