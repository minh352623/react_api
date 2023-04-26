/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
        "max-height": "max-height",

        spacing: "margin, padding",
      },
    },
  },

  plugins: [],
};
