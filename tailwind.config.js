/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",  // Ensure EJS files are included
    "./public/**/*.css",
    "./partials/**/*.ejs"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
