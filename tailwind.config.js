//themes

const myTheme = {
  default: {
    primary: 'hsl(227, 23%, 20%)',
    secondary: 'hsl(255, 9%, 69%)',
    error: 'hsl(9, 52%, 57%)',
    accent: 'hsl(316, 96%, 60%)',
    neutral: 'hsl(240, 11%, 8%)',
    info: 'hsl(207, 100%, 50%)',
    success: 'hsl(100, 57%, 53%)',
    warning: 'hsl(50, 98%, 50%)',
    'primary-content': 'hsl(0, 0%, 98%)',
    'error-content': 'hsl(0, 0%, 98%)',
    'base-100': 'hsl(190, 4%, 9%)',
    'base-200': 'hsl(190, 4%, 8%)',
    'base-300': 'hsl(190, 4%, 5%)',
  },
};

const pastelTheme = {
  default: {
    primary: 'hsl(180, 28%, 65%)',
    secondary: 'hsl(21, 54%, 83%)',
    error: 'hsl(4, 87%, 74%)',
    accent: 'hsl(93, 27%, 73%)',
    neutral: 'hsl(38, 31%, 91%)',
    info: 'hsl(163, 40%, 79%)',
    success: 'hsl(93, 27%, 73%)',
    warning: 'hsl(40, 76%, 73%)',
    'primary-content': 'hsl(0, 0%, 12%)',
    'error-content': 'hsl(0, 0%, 12%)',
    'base-100': 'hsl(0, 0%, 85%)',
    'base-200': 'hsl(0, 0%, 82%)',
    'base-300': 'hsl(0, 0%, 78%)',
    'base-400': 'hsl(0, 0%, 75%)',
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    require('daisyui'),
    require('tailwindcss-animate'),
  ],

  daisyui: {
    logs: false,
    themes: [myTheme],
  },
};
