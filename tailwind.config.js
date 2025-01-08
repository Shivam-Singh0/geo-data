const { nextui } = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Your project's source files
    "./pages/**/*.{js,ts,jsx,tsx}", // Pages (Next.js projects)
    "./components/**/*.{js,ts,jsx,tsx}", // Reusable components
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", // NextUI components
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};
