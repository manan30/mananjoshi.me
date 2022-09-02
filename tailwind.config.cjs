/* eslint-disable @typescript-eslint/no-var-requires */

const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.gray['700'],
          light: colors.gray['50']
        }
      }
    }
  },
  plugins: []
};
