module.exports = {
  content: [
    "./src/index.html",
    "./src/**/*.{html,ts}",
  ],
  safelist: [
    {
      pattern: /ml-\d+/,
    },
    {
      pattern: /pl-\d+/,
    },
    {
      pattern: /border-(red|blue|green|yellow|gray)-\d+/,
    },
    {
      pattern: /bg-(red|blue|green|yellow|gray)-\d+/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
