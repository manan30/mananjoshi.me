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
          dark: colors.gray['900'],
          light: colors.slate['200']
        }
      },
      fontFamily: { sans: ['Rubik', ...defaultTheme.fontFamily.sans] }
    }
  },
  plugins: []
};
