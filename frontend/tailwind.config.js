/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          slate: "#0B132B",
          primary: "#1C4ED8",
          accent: "#2563EB",
          light: "#F0F7FF",
          border: "#E0EDFD",
        }
      }
    },
  },
  plugins: [],
};