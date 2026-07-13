/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./admin.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B12",
        signal: "#FF5A36",
        violet: "#6C3CE0",
        cream: "#FFF8F0",
        gold: "#F2B705",
        slateink: "#181822",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "signal-gradient": "linear-gradient(135deg, #FF5A36 0%, #FF8A3D 100%)",
        "violet-gradient": "linear-gradient(135deg, #6C3CE0 0%, #4B2AA8 100%)",
      },
    },
  },
  plugins: [],
};
