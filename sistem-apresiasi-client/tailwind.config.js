/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      boxShadow: {
        boxShadow: "inset -1px -2px 15px 0px LightGray",
        Shadow: "-0.1px -0.1px 10px 0.2px LightGray",
      },
      colors: {
        primary: "#00040f",
        secondary: "#54BD95",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
        customPurple: "#6E5BA5 ",
        customGray: "#303030",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
