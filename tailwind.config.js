/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/**/*.css'],
  corePlugins: {
    preflight: process.env.NODE_ENV !== 'production',
  },
};
