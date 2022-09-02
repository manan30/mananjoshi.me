module.exports = {
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'none',
  plugins: [
    require.resolve('prettier-plugin-astro'),
    require('prettier-plugin-tailwindcss')
  ],
  tailwindConfig: './tailwind.config.cjs',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
};
