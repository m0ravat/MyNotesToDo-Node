/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Views/**/*.ejs",  // Updated to match your folder case (Views instead of views)
    "./public/**/*.css",
    "./public/**/*.js",  // Added JavaScript files in case you have any JS with Tailwind classes
    "./partials/**/*.ejs"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
