/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9795f0",
        "secondary-purple": "#e3eeff",
        "secondary-pink": "#f3e7e9",
      },
    },
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      md: "768px",
      lg: "1024px",
    },
  },
  plugins: [],
};
