/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // if you're using App Router
  ],
  theme: {
    extend: {
      colors: {
        dark: "#333333",
      },
    },
  },
  plugins: [],
};
