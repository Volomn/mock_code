/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-montserrat)"],
        secondary: ["var(--font-sora)"],
      },
      colors: {
        primary: {
          "01": "#1B2063",
        },
        neutral: {
          "00": "#ffffff",
          "01": "#F3F5F7",
        },
        shade: {
          "01": "#312A50",
        },
        secondary: {
          100: "#FBB040",
        },
      },
    },
  },
  plugins: [],
};
