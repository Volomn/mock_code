/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-primary)"],
        secondary: ["var(--font-secondary)"],
      },
      colors: {
        primary: {
          "01": "#1B2063",
          "light-blue": "#E7F4FF",
        },
        secondary: {
          10: "#FBB0401A",
          40: "#FBB04066",
          100: "#FBB040",
        },
        shade: {
          "01": "#312A50",
        },
        neutral: {
          "02": "#FFF8E8",
        },
        redd: {
          "02": "#DF2935",
        },
        accent: {
          10: "#989FCE1A",
          100: "#989FCE",
        },
      },
    },
  },
  plugins: [],
};
